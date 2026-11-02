// EDITOR: formulario das categorias e itens, montado a partir dos dados.
// Os textos da interface vem de traducoes/carta.js (CARTA.t). O que a pessoa digita vai so para os dados.
var CARTA = window.CARTA || {}

CARTA.t = function (chave) { return textoJS("carta." + chave) }

function criar(tag, atributos, texto) {
    var e = document.createElement(tag)
    Object.keys(atributos || {}).forEach(function (k) {
        if (k === "classe") e.className = atributos[k]
        else if (atributos[k] !== null && atributos[k] !== undefined) e.setAttribute(k, atributos[k])
    })
    if (texto !== undefined) e.textContent = texto
    return e
}

function campo(rotulo, id, controle) {
    var div = criar("div", { classe: "carta-campo" })
    div.appendChild(criar("label", { for: id }, rotulo))
    div.appendChild(controle)
    return div
}

function botaoMini(acao, rotulo, simbolo, desativado) {
    var b = criar("button", { type: "button", classe: "carta-mini", "data-acao": acao, "aria-label": rotulo, title: rotulo }, simbolo)
    if (desativado) b.disabled = true
    return b
}

// desenha a lista de categorias e itens dentro de `caixa`
CARTA.desenharEditor = function (d, caixa) {
    caixa.innerHTML = ""
    var idiomaUi = document.documentElement.lang
    var nomesAlergenos = CARTA.NOMES_ALERGENOS[idiomaUi] || CARTA.NOMES_ALERGENOS.es

    d.categorias.forEach(function (cat, ci) {
        var bloco = criar("div", { classe: "carta-categoria", "data-c": ci })
        var topo = criar("div", { classe: "carta-categoria-topo" })
        var nome = criar("input", { type: "text", id: "cat-" + ci, classe: "carta-input carta-input-categoria", "data-campo": "categoria",
                                    maxlength: CARTA.MAX.categoria, placeholder: CARTA.t("phCategoria") })
        nome.value = cat.nombre
        topo.appendChild(campo(CARTA.t("lblCategoria") + " " + (ci + 1), "cat-" + ci, nome))
        var botoes = criar("div", { classe: "carta-mini-grupo" })
        botoes.appendChild(botaoMini("cat-subir", CARTA.t("subir"), "↑", ci === 0))
        botoes.appendChild(botaoMini("cat-baixar", CARTA.t("bajar"), "↓", ci === d.categorias.length - 1))
        botoes.appendChild(botaoMini("cat-remover", CARTA.t("eliminarCategoria"), "✕", d.categorias.length === 1))
        topo.appendChild(botoes)
        bloco.appendChild(topo)

        cat.itens.forEach(function (it, ii) {
            var id = "it-" + ci + "-" + ii
            var item = criar("div", { classe: "carta-item", "data-i": ii })
            var modo = CARTA.MODOS[d.modo], extraTexto = modo.extra !== "alergenos"
            var linha = criar("div", { classe: "carta-item-linha" + (extraTexto ? " com-extra" : "") })
            var n = criar("input", { type: "text", id: id + "-nome", classe: "carta-input", "data-campo": "nombre", maxlength: CARTA.MAX.itemNombre })
            n.value = it.nombre
            var p = criar("input", { type: "text", id: id + "-preco", classe: "carta-input carta-input-preco", "data-campo": "precio",
                                     maxlength: CARTA.MAX.precio, placeholder: CARTA.t("phPrecio"), inputmode: "decimal" })
            p.value = it.precio
            linha.appendChild(campo(CARTA.t("lblNombre"), id + "-nome", n))
            if (extraTexto) {   // ex.: duracao ("60 min") na Lista de servicios
                var x = criar("input", { type: "text", id: id + "-extra", classe: "carta-input", "data-campo": "extra",
                                         maxlength: CARTA.MAX.extraTexto, placeholder: CARTA.t(modo.exemploCampo) })
                x.value = it.extra
                linha.appendChild(campo(CARTA.t(modo.rotulo), id + "-extra", x))
            }
            linha.appendChild(campo(CARTA.t("lblPrecio"), id + "-preco", p))
            item.appendChild(linha)
            var desc = criar("textarea", { id: id + "-desc", classe: "carta-input carta-input-desc", "data-campo": "descripcion", maxlength: CARTA.MAX.descripcion, rows: "2" })
            desc.value = it.descripcion
            item.appendChild(campo(CARTA.t("lblDescripcion"), id + "-desc", desc))

            if (!extraTexto) {   // alergenos (modo Carta)
                var det = criar("details", { classe: "carta-alergenos" })
                det.appendChild(criar("summary", null, CARTA.t("lblAlergenos") + (it.extra.length ? " (" + it.extra.length + ")" : "")))
                var grade = criar("div", { classe: "carta-alergenos-grade" })
                CARTA.ALERGENOS.forEach(function (a) {
                    var rot = criar("label", { classe: "carta-alergeno" })
                    var cx = criar("input", { type: "checkbox", "data-campo": "alergeno", value: a.id })
                    cx.checked = it.extra.indexOf(a.id) > -1
                    var icone = criar("span", { classe: "carta-alergeno-icone", "aria-hidden": "true" })
                    icone.innerHTML = CARTA.svgAlergeno(a.id)   // desenho fixo nosso
                    rot.appendChild(cx); rot.appendChild(icone); rot.appendChild(criar("span", null, nomesAlergenos[a.id]))
                    grade.appendChild(rot)
                })
                det.appendChild(grade)
                item.appendChild(det)
            }

            var acoes = criar("div", { classe: "carta-mini-grupo carta-item-acoes" })
            acoes.appendChild(botaoMini("item-subir", CARTA.t("subir"), "↑", ii === 0))
            acoes.appendChild(botaoMini("item-baixar", CARTA.t("bajar"), "↓", ii === cat.itens.length - 1))
            acoes.appendChild(botaoMini("item-remover", CARTA.t("eliminarProducto"), "✕", cat.itens.length === 1))
            item.appendChild(acoes)
            bloco.appendChild(item)
        })

        var addItem = criar("button", { type: "button", classe: "carta-adicionar", "data-acao": "item-add" }, CARTA.t("addProducto"))
        if (cat.itens.length >= CARTA.LIMITES.itens) { addItem.disabled = true; bloco.appendChild(criar("p", { classe: "carta-limite" }, CARTA.t("limiteItens"))) }
        bloco.appendChild(addItem)
        caixa.appendChild(bloco)
    })

    var addCat = criar("button", { type: "button", classe: "carta-adicionar carta-adicionar-categoria", "data-acao": "cat-add" }, CARTA.t("addCategoria"))
    if (d.categorias.length >= CARTA.LIMITES.categorias) { addCat.disabled = true; caixa.appendChild(criar("p", { classe: "carta-limite" }, CARTA.t("limiteCategorias"))) }
    caixa.appendChild(addCat)
}
