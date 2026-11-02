// GERADOR DO PDF (pdfmake), tudo no navegador: nenhum dado sai do dispositivo.
// A biblioteca (~1 MB) e as fontes so sao baixadas quando a pessoa clica em "Descargar PDF".
var CARTA = window.CARTA || {}

var _promessaPdfmake = null
var _fontesCarregadas = {}

function carregarPdfmake(url) {
    if (window.pdfMake) return Promise.resolve(window.pdfMake)
    if (!_promessaPdfmake) _promessaPdfmake = new Promise(function (ok, falha) {
        var s = document.createElement("script")
        s.src = url
        s.onload = function () {
            // proibe a biblioteca de baixar qualquer coisa da internet (fontes/imagens por URL)
            window.pdfMake.setUrlAccessPolicy(function () { return false })
            ok(window.pdfMake)
        }
        s.onerror = function () { _promessaPdfmake = null; falha(new Error("pdfmake")) }
        document.head.appendChild(s)
    })
    return _promessaPdfmake
}

function paraBase64(buffer) {
    var bytes = new Uint8Array(buffer), partes = [], passo = 0x8000
    for (var i = 0; i < bytes.length; i += passo) partes.push(String.fromCharCode.apply(null, bytes.subarray(i, i + passo)))
    return btoa(partes.join(""))
}

// entrega ao pdfmake so as fontes que o estilo usa (cada arquivo baixado uma vez)
function carregarFontes(pdfMake, estilo, urlFontes) {
    var familias = CARTA.fontesDoEstilo(estilo), arquivos = []
    familias.forEach(function (f) {
        var m = CARTA.FONTES[f]
        Object.keys(m).forEach(function (k) { if (arquivos.indexOf(m[k]) === -1) arquivos.push(m[k]) })
    })
    var faltam = arquivos.filter(function (a) { return !_fontesCarregadas[a] })
    return Promise.all(faltam.map(function (a) {
        return fetch(urlFontes + a).then(function (r) { if (!r.ok) throw new Error(a); return r.arrayBuffer() })
            .then(function (b) { _fontesCarregadas[a] = paraBase64(b) })
    })).then(function () {
        var vfs = {}, fontes = {}
        arquivos.forEach(function (a) { vfs[a] = _fontesCarregadas[a] })
        familias.forEach(function (f) { fontes[f] = CARTA.FONTES[f] })
        pdfMake.addVirtualFileSystem(vfs)
        pdfMake.addFonts(fontes)
    })
}

function maiusculas(texto, idioma) { return texto.toLocaleUpperCase(idioma) }

function iconesPdf(ids, e) {
    var colunas = ids.map(function (id) { return { svg: CARTA.svgAlergeno(id, e.cores.icones), width: e.icone, height: e.icone } })
    colunas.push({ text: "", width: "*" })
    return { columns: colunas, columnGap: 2.5, margin: [0, 3, 0, 0] }
}

// monta o documento do pdfmake a partir dos mesmos dados e estilo da previa
CARTA.montarDocumento = function (d, marca, dominio) {
    var e = CARTA.ESTILOS[d.estilo], c = e.cores, t = e.tam
    var largura = CARTA.LARGURA_A4 - 2 * CARTA.MARGEM
    var conteudo = []

    conteudo.push({ text: d.negocio.nombre, font: e.fonteTitulo, bold: true, fontSize: t.negocio, alignment: e.alinhamento, lineHeight: 1.1 })
    var contato = [d.negocio.direccion, d.negocio.telefono].filter(function (x) { return x.trim() }).join("  ·  ")
    if (contato) conteudo.push({ text: contato, fontSize: t.contato, color: c.suave, alignment: e.alinhamento, margin: [0, 5, 0, 0], characterSpacing: 0.4 })
    conteudo.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: largura, y2: 0, lineWidth: 0.75, lineColor: c.linha }], margin: [0, 10, 0, 12] })

    var usados = []
    d.categorias.forEach(function (cat) {
        var itens = cat.itens.filter(CARTA.itemTemConteudo)
        if (!itens.length && !cat.nombre.trim()) return
        var titulo = []
        if (cat.nombre.trim()) {
            titulo.push({ text: e.categoria.caixaAlta ? maiusculas(cat.nombre, d.idiomaCarta) : cat.nombre, font: e.fonteTitulo, fontSize: t.categoria,
                          color: c.acento, bold: e.categoria.negrito, characterSpacing: e.categoria.espacamento, alignment: e.alinhamento, margin: [0, 12, 0, 0] })
            titulo.push(e.categoria.filete === "centro"
                ? { canvas: [{ type: "line", x1: 0, y1: 0, x2: 40, y2: 0, lineWidth: 0.75, lineColor: c.linha }], margin: [(largura - 40) / 2, 5, 0, 10] }
                : { canvas: [{ type: "rect", x: 0, y: 0, w: 28, h: 2, color: c.acento }], margin: [0, 5, 0, 10] })
        }
        var blocos = itens.map(function (i) {
            var esq = [{ text: i.nombre, font: e.fonteItem || e.fonteTexto, fontSize: t.item, bold: e.item.nomeNegrito, lineHeight: 1.2 }]
            if (i.descripcion.trim()) esq.push({ text: i.descripcion, fontSize: t.descricao, color: c.suave, italics: e.item.descricaoItalico, lineHeight: 1.25, margin: [0, 1.5, 0, 0] })
            if (Array.isArray(i.extra) && i.extra.length) {
                esq.push(iconesPdf(i.extra, e))
                i.extra.forEach(function (id) { if (usados.indexOf(id) === -1) usados.push(id) })
            }
            return { columns: [{ width: "*", stack: esq },
                               { width: "auto", text: i.precio, fontSize: t.preco, bold: e.item.precoNegrito, color: e.item.precoAcento ? c.acento : c.texto, lineHeight: 1.2 }],
                     columnGap: 12, margin: [0, 0, 0, 8], unbreakable: true }
        })
        // o titulo da categoria nunca fica sozinho no fim da pagina: vai junto com o primeiro item
        conteudo.push({ stack: titulo.concat(blocos.slice(0, 1)), unbreakable: true })
        blocos.slice(1).forEach(function (b) { conteudo.push(b) })
    })

    if (usados.length) {
        var nomes = CARTA.NOMES_ALERGENOS[d.idiomaCarta], celulas = []
        CARTA.ALERGENOS.forEach(function (a) {
            if (usados.indexOf(a.id) === -1) return
            celulas.push({ columns: [{ svg: CARTA.svgAlergeno(a.id, c.icones), width: e.icone, height: e.icone },
                                     { text: nomes[a.id], fontSize: t.legenda, color: c.suave, margin: [4, 1, 0, 0] }], columnGap: 0 })
        })
        while (celulas.length % 3) celulas.push({ text: "" })
        var linhas = []
        for (var k = 0; k < celulas.length; k += 3) linhas.push(celulas.slice(k, k + 3))
        conteudo.push({ stack: [
            { canvas: [{ type: "line", x1: 0, y1: 0, x2: largura, y2: 0, lineWidth: 0.75, lineColor: c.linha }], margin: [0, 16, 0, 8] },
            { text: maiusculas(CARTA.TEXTOS_PDF[d.idiomaCarta].alergenos, d.idiomaCarta), fontSize: t.legenda + 0.5, bold: true, color: c.acento,
              characterSpacing: 1, alignment: e.alinhamento, margin: [0, 0, 0, 6] },
            { table: { widths: ["*", "*", "*"], body: linhas }, layout: "noBorders" }
        ], unbreakable: true })
    }

    var marcaDagua = CARTA.textoMarcaDagua(d.idiomaCarta, marca, dominio)
    return {
        pageSize: "A4",
        pageMargins: [CARTA.MARGEM, CARTA.MARGEM, CARTA.MARGEM, CARTA.MARGEM],
        info: { title: d.negocio.nombre || "Carta", creator: marca, producer: marca },
        defaultStyle: { font: e.fonteTexto, color: c.texto, fontSize: t.item },
        content: conteudo,
        // marca d'agua discreta no rodape de TODAS as paginas (+ numero da pagina se houver mais de uma)
        footer: function (pagina, total) {
            return { text: marcaDagua + (total > 1 ? "   ·   " + pagina + "/" + total : ""), alignment: "center", fontSize: 7.5,
                     color: "#9a9a9a", margin: [CARTA.MARGEM, 18, CARTA.MARGEM, 0] }
        }
    }
}

CARTA.nomeArquivo = function (d) {
    var base = (d.negocio.nombre || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50)
    return (base || d.modo) + ".pdf"
}

// cria o PDF (sem baixar): usado pelo botao e pelos testes
CARTA.criarPdf = function (d, opcoes) {
    return carregarPdfmake(opcoes.urlPdfmake).then(function (pdfMake) {
        return carregarFontes(pdfMake, d.estilo, opcoes.urlFontes).then(function () {
            return pdfMake.createPdf(CARTA.montarDocumento(d, opcoes.marca, opcoes.dominio))
        })
    })
}

CARTA.baixarPdf = function (d, opcoes) {
    return CARTA.criarPdf(d, opcoes).then(function (pdf) { return pdf.download(CARTA.nomeArquivo(d)) })
}
