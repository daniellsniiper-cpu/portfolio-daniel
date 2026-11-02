// LIGA TUDO: dados -> editor -> previa -> rascunho -> PDF.
var CARTA = window.CARTA || {}

;(function () {
    var raiz = document.getElementById("ferramenta-carta")
    if (!raiz) return
    var opcoes = {
        urlPdfmake: raiz.dataset.pdfmake,
        urlFontes: raiz.dataset.fontes,
        marca: document.body.dataset.marca,
        dominio: raiz.dataset.dominio || ""        // so vem da SITE_URL; vazio = sem endereco na marca d'agua
    }
    var $ = function (id) { return document.getElementById(id) }
    var editor = $("carta-editor-conteudo"), folha = $("carta-folha"), moldura = $("carta-moldura")
    // estado = { modo, docs: { carta: {...}, servicios: {...} } }; d = documento do modo atual
    var estado = CARTA.carregarRascunho() || CARTA.estadoNovo(document.documentElement.lang)
    var d = estado.docs[estado.modo]

    // ----- previa (folha A4 reduzida para caber na coluna) -----
    function ajustarEscala() {
        var largura = folha.offsetWidth
        if (!largura || !moldura.clientWidth) return
        var s = Math.min(1, moldura.clientWidth / largura)
        folha.style.transform = "scale(" + s + ")"
        moldura.style.height = Math.ceil(folha.offsetHeight * s) + "px"
    }
    function atualizarPrevia() {
        CARTA.desenharPrevia(d, folha, opcoes.marca, opcoes.dominio)
        ajustarEscala()
    }
    function mudou() { atualizarPrevia(); CARTA.salvarRascunho(estado) }

    // ----- controles fixos (estilo, idioma da carta, negocio) -----
    function desenharEstilos() {
        var caixa = $("carta-estilos")
        caixa.innerHTML = ""
        CARTA.MODOS[d.modo].estilos.forEach(function (id) {
            var b = document.createElement("button")
            b.type = "button"; b.className = "carta-opcao" + (d.estilo === id ? " ativo" : "")
            b.dataset.estilo = id; b.textContent = CARTA.t("estilo_" + id)
            b.setAttribute("aria-pressed", d.estilo === id ? "true" : "false")
            caixa.appendChild(b)
        })
    }
    function preencherControles() {
        document.querySelectorAll("[data-modo]").forEach(function (b) {
            var ativo = b.dataset.modo === d.modo
            b.classList.toggle("ativo", ativo); b.setAttribute("aria-pressed", ativo ? "true" : "false")
        })
        desenharEstilos()
        $("carta-aviso-alergenos").hidden = CARTA.MODOS[d.modo].extra !== "alergenos"   // aviso so faz sentido no modo Carta
        $("carta-idioma").value = d.idiomaCarta
        $("carta-iva").checked = d.ivaIncluido
        $("carta-negocio-nombre").value = d.negocio.nombre
        $("carta-negocio-direccion").value = d.negocio.direccion
        $("carta-negocio-telefono").value = d.negocio.telefono
    }
    function desenharTudo() { preencherControles(); CARTA.desenharEditor(d, editor); atualizarPrevia() }

    // trocar de modo: mostra o documento daquele modo (o dos outros modos continua guardado)
    document.querySelectorAll("[data-modo]").forEach(function (b) {
        b.addEventListener("click", function () {
            var m = b.dataset.modo
            if (b.disabled || m === estado.modo) return
            if (!estado.docs[m]) estado.docs[m] = CARTA.documentoNovo(m, document.documentElement.lang, true)
            estado.modo = m; d = estado.docs[m]
            $("carta-painel").hidden = true
            desenharTudo(); CARTA.salvarRascunho(estado)
        })
    })

    $("carta-estilos").addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-estilo]"); if (!b) return
        d.estilo = b.dataset.estilo; desenharEstilos(); mudou()
    })
    $("carta-idioma").addEventListener("change", function () { d.idiomaCarta = this.value; mudou() })
    $("carta-iva").addEventListener("change", function () { d.ivaIncluido = this.checked; mudou() })
    ;[["carta-negocio-nombre", "nombre"], ["carta-negocio-direccion", "direccion"], ["carta-negocio-telefono", "telefono"]].forEach(function (x) {
        $(x[0]).addEventListener("input", function () { d.negocio[x[1]] = this.value; mudou() })
    })

    // ----- editor: digitacao (sem redesenhar o formulario, para nao perder o foco) -----
    function posicao(alvo) {
        var c = alvo.closest("[data-c]"), i = alvo.closest("[data-i]")
        return { c: c ? +c.dataset.c : -1, i: i ? +i.dataset.i : -1 }
    }
    editor.addEventListener("input", function (ev) {
        var a = ev.target, p = posicao(a), campo = a.dataset.campo
        if (!campo || p.c < 0) return
        if (campo === "categoria") d.categorias[p.c].nombre = a.value
        else if (campo === "alergeno") return
        else if (campo === "extra") d.categorias[p.c].itens[p.i].extra = a.value
        else d.categorias[p.c].itens[p.i][campo] = a.value
        mudou()
    })
    editor.addEventListener("change", function (ev) {
        var a = ev.target, p = posicao(a)
        if (a.dataset.campo !== "alergeno") return
        var lista = d.categorias[p.c].itens[p.i].extra
        if (a.checked && lista.indexOf(a.value) === -1) lista.push(a.value)
        if (!a.checked && lista.indexOf(a.value) > -1) lista.splice(lista.indexOf(a.value), 1)
        var resumo = a.closest("details").querySelector("summary")
        resumo.textContent = CARTA.t("lblAlergenos") + (lista.length ? " (" + lista.length + ")" : "")
        mudou()
    })
    // sugestoes ao sair do campo: "12,5" vira "12,50 €" e, na duracao, "45" vira "45 min"
    editor.addEventListener("focusout", function (ev) {
        var a = ev.target, p = posicao(a), campo = a.dataset.campo, novo = a.value
        if (campo === "precio") novo = CARTA.sugerirPreco(a.value, d.idiomaCarta)
        else if (campo === "extra" && CARTA.MODOS[d.modo].extra === "duracion") novo = CARTA.sugerirDuracao(a.value)
        else return
        if (novo !== a.value) { a.value = novo; d.categorias[p.c].itens[p.i][campo] = novo; mudou() }
    })

    // ----- editor: adicionar, mover e remover (redesenha e devolve o foco) -----
    function trocar(lista, a, b) { var x = lista[a]; lista[a] = lista[b]; lista[b] = x }
    editor.addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-acao]"); if (!b || b.disabled) return
        var p = posicao(b), acao = b.dataset.acao, foco = null
        if (acao === "cat-add") { d.categorias.push(CARTA.categoriaVazia(d.modo)); foco = "cat-" + (d.categorias.length - 1) }
        if (acao === "cat-subir") { trocar(d.categorias, p.c, p.c - 1); foco = "cat-" + (p.c - 1) }
        if (acao === "cat-baixar") { trocar(d.categorias, p.c, p.c + 1); foco = "cat-" + (p.c + 1) }
        if (acao === "cat-remover") {
            var temConteudo = d.categorias[p.c].nombre.trim() || d.categorias[p.c].itens.some(CARTA.itemTemConteudo)
            if (temConteudo && !confirm(CARTA.t("confirmarEliminarCategoria" + CARTA.MODOS[d.modo].item))) return
            d.categorias.splice(p.c, 1); foco = "cat-" + Math.max(0, p.c - 1)
        }
        var itens = p.c > -1 ? d.categorias[p.c] && d.categorias[p.c].itens : null
        if (acao === "item-add") { itens.push(CARTA.itemVazio(d.modo)); foco = "it-" + p.c + "-" + (itens.length - 1) + "-nome" }
        if (acao === "item-subir") { trocar(itens, p.i, p.i - 1); foco = "it-" + p.c + "-" + (p.i - 1) + "-nome" }
        if (acao === "item-baixar") { trocar(itens, p.i, p.i + 1); foco = "it-" + p.c + "-" + (p.i + 1) + "-nome" }
        if (acao === "item-remover") { itens.splice(p.i, 1); foco = "it-" + p.c + "-" + Math.max(0, p.i - 1) + "-nome" }
        CARTA.desenharEditor(d, editor); mudou()
        if (foco && $(foco)) $(foco).focus()
    })

    // ----- abas no celular: EDITAR / VISTA PREVIA -----
    document.querySelectorAll("[data-aba]").forEach(function (aba) {
        aba.addEventListener("click", function () {
            raiz.dataset.abaAtiva = aba.dataset.aba
            document.querySelectorAll("[data-aba]").forEach(function (x) { x.setAttribute("aria-selected", x === aba ? "true" : "false") })
            ajustarEscala()
        })
    })
    window.addEventListener("resize", ajustarEscala)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarEscala)

    // ----- baixar PDF + painel "carta online com QR" -----
    var botaoPdf = $("carta-baixar"), erro = $("carta-erro"), painel = $("carta-painel")
    botaoPdf.addEventListener("click", function () {
        var textoOriginal = botaoPdf.textContent
        botaoPdf.disabled = true; botaoPdf.textContent = CARTA.t("generando"); erro.hidden = true
        CARTA.baixarPdf(d, opcoes).then(function () {
            painel.hidden = false
            painel.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }).catch(function () {
            erro.textContent = CARTA.t("erroPdf"); erro.hidden = false
        }).then(function () { botaoPdf.disabled = false; botaoPdf.textContent = textoOriginal })
    })
    $("carta-painel-fechar").addEventListener("click", function () { painel.hidden = true })

    // ----- empezar de nuevo -----
    $("carta-reiniciar").addEventListener("click", function () {
        if (!confirm(CARTA.t("confirmarReiniciar"))) return
        // limpa so o documento do modo atual (os outros modos continuam guardados)
        var novo = CARTA.documentoNovo(estado.modo, document.documentElement.lang, false)
        novo.estilo = d.estilo; novo.idiomaCarta = d.idiomaCarta; novo.ivaIncluido = d.ivaIncluido
        estado.docs[estado.modo] = d = novo
        painel.hidden = true
        desenharTudo(); CARTA.salvarRascunho(estado)
    })

    // ao trocar o idioma do SITE, os rotulos do editor mudam (a carta continua no idioma escolhido para ela)
    document.addEventListener("idioma", function () { desenharEstilos(); CARTA.desenharEditor(d, editor) })

    desenharTudo()
    CARTA._estado = function () { return d }          // usados pelos testes
    CARTA._estadoCompleto = function () { return estado }
})()
