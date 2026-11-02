// ESTADO DA FERRAMENTA: os dados da carta + rascunho no localStorage (so neste navegador).
// Nada e enviado a nenhum servidor.
var CARTA = window.CARTA || {}

CARTA.CHAVE_RASCUNHO = "carta-rascunho-v1"
CARTA.LIMITES = { categorias: 20, itens: 60 }
// tamanho maximo de cada campo (evita textos gigantes no PDF e no localStorage)
CARTA.MAX = { negocioNombre: 60, direccion: 120, telefono: 40, categoria: 60, itemNombre: 80, descripcion: 200, precio: 20, extraTexto: 30 }

CARTA.itemVazio = function () { return { nombre: "", descripcion: "", precio: "", extra: [] } }
CARTA.categoriaVazia = function () { return { nombre: "", itens: [CARTA.itemVazio()] } }

CARTA.estadoNovo = function (idiomaInterface, comExemplo) {
    var base = comExemplo ? CARTA.exemplo("carta", idiomaInterface)
                          : { negocio: { nombre: "", direccion: "", telefono: "" }, categorias: [CARTA.categoriaVazia()] }
    return { versao: 1, modo: "carta", estilo: "elegante", idiomaCarta: ["es", "pt", "en"].indexOf(idiomaInterface) > -1 ? idiomaInterface : "es",
             negocio: base.negocio, categorias: base.categorias }
}

// confere e "limpa" dados vindos do localStorage (podem estar velhos ou corrompidos)
CARTA.normalizar = function (d) {
    if (!d || typeof d !== "object" || d.versao !== 1) return null
    var txt = function (v, max) { return typeof v === "string" ? v.slice(0, max) : "" }
    var modo = CARTA.MODOS[d.modo] && CARTA.MODOS[d.modo].disponivel ? d.modo : "carta"
    var estilos = CARTA.MODOS[modo].estilos
    var ids = CARTA.ALERGENOS.map(function (a) { return a.id })
    var cats = Array.isArray(d.categorias) ? d.categorias.slice(0, CARTA.LIMITES.categorias) : []
    var n = d.negocio || {}
    return {
        versao: 1, modo: modo,
        estilo: estilos.indexOf(d.estilo) > -1 ? d.estilo : estilos[0],
        idiomaCarta: ["es", "pt", "en"].indexOf(d.idiomaCarta) > -1 ? d.idiomaCarta : "es",
        negocio: { nombre: txt(n.nombre, CARTA.MAX.negocioNombre), direccion: txt(n.direccion, CARTA.MAX.direccion), telefono: txt(n.telefono, CARTA.MAX.telefono) },
        categorias: cats.map(function (c) {
            var itens = Array.isArray(c && c.itens) ? c.itens.slice(0, CARTA.LIMITES.itens) : []
            return { nombre: txt(c && c.nombre, CARTA.MAX.categoria), itens: itens.map(function (i) {
                i = i || {}
                var extra = modo === "carta" ? (Array.isArray(i.extra) ? i.extra.filter(function (x) { return ids.indexOf(x) > -1 }) : [])
                                             : txt(i.extra, CARTA.MAX.extraTexto)
                return { nombre: txt(i.nombre, CARTA.MAX.itemNombre), descripcion: txt(i.descripcion, CARTA.MAX.descripcion), precio: txt(i.precio, CARTA.MAX.precio), extra: extra }
            }) }
        })
    }
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

// um item so aparece na carta se tiver nome ou preco
CARTA.itemTemConteudo = function (i) { return !!(i.nombre.trim() || i.precio.trim()) }

// "12" ou "12,5" vira "12,50 €" (ou "€12.50" em ingles). Textos como "desde 25 €" ficam como estao.
CARTA.sugerirPreco = function (valor, idiomaCarta) {
    var m = /^\s*(\d{1,6})(?:[.,](\d{1,2}))?\s*€?\s*$/.exec(valor)
    if (!m) return valor
    var dec = (m[2] || "00").padEnd(2, "0")
    return idiomaCarta === "en" ? "€" + m[1] + "." + dec : m[1] + "," + dec + " €"
}
