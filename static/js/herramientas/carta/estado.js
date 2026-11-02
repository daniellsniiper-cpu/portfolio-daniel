// ESTADO DA FERRAMENTA: um documento por modo (carta, servicios, precios) + rascunho no localStorage.
// Trocar de modo nao apaga nada: cada modo guarda o seu documento. Nada e enviado a nenhum servidor.
var CARTA = window.CARTA || {}

CARTA.CHAVE_RASCUNHO = "carta-rascunho-v1"   // nome citado na politica de cookies
CARTA.LIMITES = { categorias: 20, itens: 60 }
// tamanho maximo de cada campo (evita textos gigantes no PDF e no localStorage)
CARTA.MAX = { negocioNombre: 60, direccion: 120, telefono: 40, categoria: 60, itemNombre: 80, descripcion: 200, precio: 20, extraTexto: 30 }

CARTA.extraVazio = function (modo) { return CARTA.MODOS[modo].extra === "alergenos" ? [] : "" }
CARTA.itemVazio = function (modo) { return { nombre: "", descripcion: "", precio: "", extra: CARTA.extraVazio(modo) } }
CARTA.categoriaVazia = function (modo) { return { nombre: "", itens: [CARTA.itemVazio(modo)] } }

// documento de um modo: com conteudo de exemplo (primeira vez) ou vazio ("Empezar de nuevo")
CARTA.documentoNovo = function (modo, idiomaInterface, comExemplo) {
    var idioma = ["es", "pt", "en"].indexOf(idiomaInterface) > -1 ? idiomaInterface : "es"
    var base = comExemplo ? CARTA.exemplo(modo, idioma)
                          : { negocio: { nombre: "", direccion: "", telefono: "" }, categorias: [CARTA.categoriaVazia(modo)] }
    return { modo: modo, estilo: CARTA.MODOS[modo].estilos[0], idiomaCarta: idioma, ivaIncluido: true, negocio: base.negocio, categorias: base.categorias }
}

CARTA.estadoNovo = function (idiomaInterface) {
    return { versao: 2, modo: "carta", docs: { carta: CARTA.documentoNovo("carta", idiomaInterface, true) } }
}

// confere e "limpa" um documento vindo do localStorage (pode estar velho ou corrompido)
CARTA.normalizarDocumento = function (d, modo) {
    if (!d || typeof d !== "object") return null
    var txt = function (v, max) { return typeof v === "string" ? v.slice(0, max) : "" }
    var estilos = CARTA.MODOS[modo].estilos
    var ids = CARTA.ALERGENOS.map(function (a) { return a.id })
    var alergenos = CARTA.MODOS[modo].extra === "alergenos"
    var cats = Array.isArray(d.categorias) ? d.categorias.slice(0, CARTA.LIMITES.categorias) : []
    var n = d.negocio || {}
    return {
        modo: modo,
        estilo: estilos.indexOf(d.estilo) > -1 ? d.estilo : estilos[0],
        idiomaCarta: ["es", "pt", "en"].indexOf(d.idiomaCarta) > -1 ? d.idiomaCarta : "es",
        ivaIncluido: d.ivaIncluido !== false,   // rascunho antigo (sem o campo) fica ligado
        negocio: { nombre: txt(n.nombre, CARTA.MAX.negocioNombre), direccion: txt(n.direccion, CARTA.MAX.direccion), telefono: txt(n.telefono, CARTA.MAX.telefono) },
        categorias: cats.map(function (c) {
            var itens = Array.isArray(c && c.itens) ? c.itens.slice(0, CARTA.LIMITES.itens) : []
            return { nombre: txt(c && c.nombre, CARTA.MAX.categoria), itens: itens.map(function (i) {
                i = i || {}
                var extra = alergenos ? (Array.isArray(i.extra) ? i.extra.filter(function (x) { return ids.indexOf(x) > -1 }) : [])
                                      : txt(i.extra, CARTA.MAX.extraTexto)
                return { nombre: txt(i.nombre, CARTA.MAX.itemNombre), descripcion: txt(i.descripcion, CARTA.MAX.descripcion), precio: txt(i.precio, CARTA.MAX.precio), extra: extra }
            }) }
        })
    }
}

CARTA.normalizar = function (e) {
    if (!e || typeof e !== "object") return null
    if (e.versao === 1) e = { versao: 2, modo: "carta", docs: { carta: e } }   // rascunho do formato antigo (so carta)
    if (e.versao !== 2 || !e.docs) return null
    var estado = { versao: 2, modo: "carta", docs: {} }
    Object.keys(CARTA.MODOS).forEach(function (m) {
        if (!CARTA.MODOS[m].disponivel || !e.docs[m]) return
        var doc = CARTA.normalizarDocumento(e.docs[m], m)
        if (doc) estado.docs[m] = doc
    })
    if (e.modo && estado.docs[e.modo]) estado.modo = e.modo
    if (!estado.docs[estado.modo]) return null
    return estado
}

CARTA.carregarRascunho = function () {
    try { return CARTA.normalizar(JSON.parse(localStorage.getItem(CARTA.CHAVE_RASCUNHO))) } catch (e) { return null }
}

var _tempoSalvar = null
CARTA.salvarRascunho = function (estado) {
    clearTimeout(_tempoSalvar)  // espera a pessoa parar de digitar um instante
    _tempoSalvar = setTimeout(function () {
        try { localStorage.setItem(CARTA.CHAVE_RASCUNHO, JSON.stringify(estado)) } catch (e) {}  // modo anonimo pode bloquear
    }, 400)
}

CARTA.apagarRascunho = function () {
    clearTimeout(_tempoSalvar)
    try { localStorage.removeItem(CARTA.CHAVE_RASCUNHO) } catch (e) {}
}

// um item so aparece no documento se tiver nome ou preco
CARTA.itemTemConteudo = function (i) { return !!(i.nombre.trim() || i.precio.trim()) }

// "12" ou "12,5" vira "12,50 €" (ou "€12.50" em ingles). Textos como "desde 25 €" ficam como estao.
CARTA.sugerirPreco = function (valor, idiomaCarta) {
    var m = /^\s*(\d{1,6})(?:[.,](\d{1,2}))?\s*€?\s*$/.exec(valor)
    if (!m) return valor
    var dec = (m[2] || "00").padEnd(2, "0")
    return idiomaCarta === "en" ? "€" + m[1] + "." + dec : m[1] + "," + dec + " €"
}

// "45" vira "45 min" na duracao (Lista de servicios). "1 h 30 min" fica como esta.
CARTA.sugerirDuracao = function (valor) {
    return /^\s*\d{1,3}\s*$/.test(valor) ? valor.trim() + " min" : valor
}
