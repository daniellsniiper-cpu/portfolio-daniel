// PREVIA AO VIVO: desenha uma folha A4 (em HTML) a partir dos dados, com o mesmo estilo do PDF.
// Todo texto digitado entra como textContent (nunca como HTML), para nada ser executado.
var CARTA = window.CARTA || {}

var PT = 96 / 72                 // 1 pt do PDF = 1,333 px na tela
CARTA.LARGURA_A4 = 595.28        // largura da folha A4 em pt
CARTA.MARGEM = 50                // margem da folha em pt

function px(pt) { return (pt * PT) + "px" }

function el(tag, estilos, texto) {
    var e = document.createElement(tag)
    if (estilos) Object.keys(estilos).forEach(function (k) { e.style[k] = estilos[k] })
    if (texto !== undefined) e.textContent = texto
    return e
}

function linhaIcones(ids, e) {
    var linha = el("div", { display: "flex", gap: px(2.5), marginTop: px(3), flexWrap: "wrap" })
    ids.forEach(function (id) {
        var s = el("span", { display: "inline-block", width: px(e.icone), height: px(e.icone) })
        s.innerHTML = CARTA.svgAlergeno(id, e.cores.icones)   // desenho fixo nosso (nao vem do usuario)
        s.firstChild.setAttribute("width", "100%"); s.firstChild.setAttribute("height", "100%")
        linha.appendChild(s)
    })
    return linha
}

CARTA.textoMarcaDagua = function (idiomaCarta, marca, dominio) {
    return CARTA.TEXTOS_PDF[idiomaCarta].hechoCon + " " + marca + (dominio ? " · " + dominio : "")
}

CARTA.desenharPrevia = function (d, folha, marca, dominio) {
    var e = CARTA.ESTILOS[d.estilo], c = e.cores, t = e.tam
    folha.innerHTML = ""
    folha.style.width = px(CARTA.LARGURA_A4)
    folha.style.padding = px(CARTA.MARGEM)
    folha.style.color = c.texto
    folha.style.fontFamily = "'" + e.fonteTexto + "', sans-serif"
    var centro = e.alinhamento === "center"

    // cabecalho: nome do negocio + contato
    var cab = el("div", { textAlign: e.alinhamento, marginBottom: px(10) })
    cab.appendChild(el("div", { fontFamily: "'" + e.fonteTitulo + "', serif", fontWeight: "700", fontSize: px(t.negocio), lineHeight: "1.2" }, d.negocio.nombre))
    var contato = [d.negocio.direccion, d.negocio.telefono].filter(function (x) { return x.trim() }).join("  ·  ")
    if (contato) cab.appendChild(el("div", { fontSize: px(t.contato), color: c.suave, marginTop: px(5), letterSpacing: "0.5px" }, contato))
    folha.appendChild(cab)
    folha.appendChild(el("div", { height: "1px", background: c.linha, margin: px(4) + " 0 " + px(16) }))

    var usados = []
    d.categorias.forEach(function (cat) {
        var itens = cat.itens.filter(CARTA.itemTemConteudo)
        if (!itens.length && !cat.nombre.trim()) return
        var bloco = el("div", { marginTop: px(14), marginBottom: px(6) })
        if (cat.nombre.trim()) {
            bloco.appendChild(el("div", {
                fontFamily: "'" + e.fonteTitulo + "', serif", fontSize: px(t.categoria), color: c.acento,
                fontWeight: e.categoria.negrito ? "700" : "400", letterSpacing: px(e.categoria.espacamento),
                textTransform: e.categoria.caixaAlta ? "uppercase" : "none", textAlign: e.alinhamento
            }, cat.nombre))
            if (e.categoria.filete === "centro") bloco.appendChild(el("div", { width: px(40), height: "1px", background: c.linha, margin: px(5) + " auto " + px(10) }))
            else bloco.appendChild(el("div", { width: px(28), height: px(2), background: c.acento, margin: px(5) + " 0 " + px(10) }))
        }
        itens.forEach(function (i) {
            var linha = el("div", { display: "flex", justifyContent: "space-between", gap: px(12), marginBottom: px(8), breakInside: "avoid" })
            var esq = el("div", { flex: "1", minWidth: "0" })
            esq.appendChild(el("div", { fontFamily: "'" + (e.fonteItem || e.fonteTexto) + "', sans-serif", fontSize: px(t.item),
                                        fontWeight: e.item.nomeNegrito ? "700" : "400", lineHeight: "1.35", overflowWrap: "anywhere" }, i.nombre))
            if (i.descripcion.trim()) esq.appendChild(el("div", { fontSize: px(t.descricao), color: c.suave, lineHeight: "1.4", marginTop: px(1.5),
                                                                  fontStyle: e.item.descricaoItalico ? "italic" : "normal", overflowWrap: "anywhere" }, i.descripcion))
            if (Array.isArray(i.extra) && i.extra.length) {
                esq.appendChild(linhaIcones(i.extra, e))
                i.extra.forEach(function (id) { if (usados.indexOf(id) === -1) usados.push(id) })
            }
            linha.appendChild(esq)
            linha.appendChild(el("div", { fontSize: px(t.preco), fontWeight: e.item.precoNegrito ? "700" : "400", whiteSpace: "nowrap",
                                         color: e.item.precoAcento ? c.acento : c.texto, lineHeight: "1.35" }, i.precio))
            bloco.appendChild(linha)
        })
        folha.appendChild(bloco)
    })

    // legenda dos alergenos usados (na ordem oficial)
    if (usados.length) {
        var nomes = CARTA.NOMES_ALERGENOS[d.idiomaCarta]
        var leg = el("div", { marginTop: px(18), paddingTop: px(10), borderTop: "1px solid " + c.linha })
        leg.appendChild(el("div", { fontSize: px(t.legenda + 0.5), fontWeight: "700", color: c.acento, marginBottom: px(6), textAlign: e.alinhamento,
                                    letterSpacing: "1px", textTransform: "uppercase" }, CARTA.TEXTOS_PDF[d.idiomaCarta].alergenos))
        var grade = el("div", { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: px(4) + " " + px(10) })
        CARTA.ALERGENOS.forEach(function (a) {
            if (usados.indexOf(a.id) === -1) return
            var it = el("div", { display: "flex", alignItems: "center", gap: px(4), fontSize: px(t.legenda), color: c.suave })
            it.appendChild(linhaIcones([a.id], e).firstChild)
            it.appendChild(el("span", null, nomes[a.id]))
            grade.appendChild(it)
        })
        leg.appendChild(grade)
        folha.appendChild(leg)
    }

    // marca d'agua (igual ao rodape do PDF)
    folha.appendChild(el("div", { marginTop: px(28), textAlign: "center", fontSize: px(7.5), color: "#9a9a9a", fontFamily: "'" + e.fonteTexto + "', sans-serif" },
                         CARTA.textoMarcaDagua(d.idiomaCarta, marca, dominio)))
    folha.dataset.centro = centro ? "1" : "0"
}
