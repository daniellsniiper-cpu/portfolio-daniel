// PREVIA AO VIVO: desenha uma folha A4 (em HTML) a partir dos dados, com o mesmo estilo do PDF.
// Todo texto digitado entra como textContent (nunca como HTML), para nada ser executado.
var CARTA = window.CARTA || {}

var PT = 96 / 72                 // 1 pt do PDF = 1,333 px na tela
CARTA.LARGURA_A4 = 595.28        // largura da folha A4 em pt
CARTA.ALTURA_A4 = 841.89
CARTA.MARGEM = 50                // margem da folha em pt
CARTA.MOLDURA = 22               // distancia da moldura dourada (estilo Lujo) ate a borda, em pt

function px(pt) { return (pt * PT) + "px" }
function fonte(nome, reserva) { return "'" + nome + "', " + (reserva || "sans-serif") }

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

// filete embaixo do titulo da categoria (mesmos desenhos do PDF)
function filete(e, largura) {
    var c = e.cores, tipo = e.categoria.filete
    if (tipo === "centro") return el("div", { width: px(40), height: "1px", background: c.linha, margin: px(5) + " auto " + px(10) })
    if (tipo === "barra") return el("div", { width: px(28), height: px(2), background: c.acento, margin: px(5) + " 0 " + px(10) })
    if (tipo === "linha") return el("div", { width: px(largura), height: "1px", background: c.linha, margin: px(5) + " 0 " + px(10) })
    // ornamento: linha + losango + linha, centralizado
    var o = el("div", { display: "flex", alignItems: "center", justifyContent: "center", gap: px(4), margin: px(6) + " 0 " + px(10) })
    o.appendChild(el("div", { width: px(30), height: "1px", background: c.linha }))
    o.appendChild(el("div", { width: px(4.2), height: px(4.2), background: c.acento, transform: "rotate(45deg)" }))
    o.appendChild(el("div", { width: px(30), height: "1px", background: c.linha }))
    return o
}

CARTA.textoMarcaDagua = function (idiomaCarta, marca, dominio) {
    return CARTA.TEXTOS_PDF[idiomaCarta].hechoCon + " " + marca + (dominio ? " · " + dominio : "")
}

CARTA.desenharPrevia = function (d, folha, marca, dominio) {
    var e = CARTA.ESTILOS[d.estilo], c = e.cores, t = e.tam, modo = CARTA.MODOS[d.modo]
    var largura = CARTA.LARGURA_A4 - 2 * CARTA.MARGEM
    folha.innerHTML = ""
    folha.style.position = "relative"
    folha.style.width = px(CARTA.LARGURA_A4)
    folha.style.minHeight = px(CARTA.ALTURA_A4)
    folha.style.padding = px(CARTA.MARGEM)
    folha.style.color = c.texto
    folha.style.fontFamily = fonte(e.fonteTexto)

    // moldura dupla dourada (so no estilo Lujo)
    if (e.moldura) {
        var m = CARTA.MOLDURA
        folha.appendChild(el("div", { position: "absolute", top: px(m), left: px(m), right: px(m), bottom: px(m), border: (0.8 * PT) + "px solid " + c.moldura, pointerEvents: "none" }))
        folha.appendChild(el("div", { position: "absolute", top: px(m + 4), left: px(m + 4), right: px(m + 4), bottom: px(m + 4), border: (0.4 * PT) + "px solid " + c.moldura, pointerEvents: "none" }))
    }

    // cabecalho: nome do negocio + contato
    var cab = el("div", { textAlign: e.alinhamento, marginBottom: px(10) })
    cab.appendChild(el("div", { fontFamily: fonte(e.fonteNegocio || e.fonteTitulo, "serif"), fontWeight: e.negocioNegrito === false ? "400" : "700",
                                fontSize: px(t.negocio), lineHeight: "1.2" }, d.negocio.nombre))
    var contato = [d.negocio.direccion, d.negocio.telefono].filter(function (x) { return x.trim() }).join("  ·  ")
    if (contato) cab.appendChild(el("div", { fontSize: px(t.contato), color: c.suave, marginTop: px(5), letterSpacing: "0.5px",
                                             fontFamily: fonte(e.fonteDescricao || e.fonteTexto) }, contato))
    folha.appendChild(cab)
    folha.appendChild(el("div", { height: "1px", background: c.linha, margin: px(4) + " 0 " + px(16) }))

    var usados = []
    d.categorias.forEach(function (cat) {
        var itens = cat.itens.filter(CARTA.itemTemConteudo)
        if (!itens.length && !cat.nombre.trim()) return
        var bloco = el("div", { marginTop: px(14), marginBottom: px(6) })
        if (cat.nombre.trim()) {
            bloco.appendChild(el("div", {
                fontFamily: fonte(e.fonteTitulo, "serif"), fontSize: px(t.categoria), color: c.acento,
                fontWeight: e.categoria.negrito ? "700" : "400", fontStyle: e.categoria.italico ? "italic" : "normal",
                letterSpacing: px(e.categoria.espacamento), textTransform: e.categoria.caixaAlta ? "uppercase" : "none", textAlign: e.alinhamento
            }, cat.nombre))
            bloco.appendChild(filete(e, largura))
        }
        itens.forEach(function (i) {
            var linha = el("div", { display: "flex", justifyContent: "space-between", gap: px(12), marginBottom: px(8), breakInside: "avoid" })
            var esq = el("div", { flex: "1", minWidth: "0" })
            esq.appendChild(el("div", { fontFamily: fonte(e.fonteItem || e.fonteTexto), fontSize: px(t.item),
                                        fontWeight: e.item.nomeNegrito ? "700" : "400", lineHeight: "1.35", overflowWrap: "anywhere" }, i.nombre))
            if (i.descripcion.trim()) esq.appendChild(el("div", { fontFamily: fonte(e.fonteDescricao || e.fonteTexto), fontSize: px(t.descricao), color: c.suave,
                                                                  lineHeight: "1.4", marginTop: px(1.5), fontStyle: e.item.descricaoItalico ? "italic" : "normal",
                                                                  overflowWrap: "anywhere" }, i.descripcion))
            if (modo.extra === "alergenos" && i.extra.length) {
                esq.appendChild(linhaIcones(i.extra, e))
                i.extra.forEach(function (id) { if (usados.indexOf(id) === -1) usados.push(id) })
            }
            linha.appendChild(esq)
            // texto extra (ex.: duracao) numa coluna antes do preco
            if (modo.extra !== "alergenos" && modo.posicao === "coluna" && i.extra.trim()) {
                linha.appendChild(el("div", { fontSize: px(t.extra || t.descricao), color: c.extra || c.suave, whiteSpace: "nowrap", lineHeight: "1.35",
                                             fontStyle: e.extraItalico ? "italic" : "normal", paddingTop: px(Math.max(0, (t.item - (t.extra || t.descricao)) / 2)) }, i.extra))
            }
            linha.appendChild(el("div", { fontSize: px(t.preco), fontWeight: e.item.precoNegrito ? "700" : "400", whiteSpace: "nowrap",
                                         color: e.item.precoAcento ? c.acento : c.texto, lineHeight: "1.35" }, i.precio))
            bloco.appendChild(linha)
        })
        folha.appendChild(bloco)
    })

    // legenda dos alergenos usados (na ordem oficial) — so no modo Carta
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
    folha.appendChild(el("div", { marginTop: px(28), textAlign: "center", fontSize: px(7.5), color: "#9a9a9a", fontFamily: fonte(e.fonteDescricao || e.fonteTexto) },
                         CARTA.textoMarcaDagua(d.idiomaCarta, marca, dominio)))
}
