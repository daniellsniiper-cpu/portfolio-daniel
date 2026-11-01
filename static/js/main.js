// JavaScript do site — antes ficava dentro do index.html

// ===== SIMBOLOS </> NO FUNDO: ajuste aqui =====
var INTERVALO_SIMBOLO = [3000, 5000]  // novo simbolo a cada 3 a 5 segundos (em ms)
var INTERVALO_CELULAR = 2             // no celular, intervalo 2x maior (menos simbolos)
var TAMANHO_SIMBOLO = [16, 24]        // largura do simbolo em px (sorteada entre os dois)
var MAX_SIMBOLOS = 3                  // maximo de simbolos na tela ao mesmo tempo
var BRILHO_SIMBOLO = 0.7              // opacidade maxima (0 = invisivel, 1 = total)
var PROFUNDIDADE = 1                  // efeito de distancia: 0 = desligado (todos perto), 1 = completo
var CAMADAS = [                       // chance de cada distancia (soma 1) e faixa de distancia (0 = perto, 1 = longe)
    { chance: 0.50, distancia: [0.8, 1.0] },   // longe
    { chance: 0.35, distancia: [0.4, 0.6] },   // medio
    { chance: 0.15, distancia: [0.0, 0.15] }   // perto
]

// CANVAS
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var particulas = []
for (var i = 0; i < 80; i++) {
    particulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2,
        subindo: false
    })
}
for (var i = 0; i < 20; i++) {
    particulas.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 1.5 + 0.5),
        r: Math.random() * 3 + 1,
        subindo: true
    })
}

function animarParticulas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particulas.forEach(function(p) {
        p.x += p.vx
        p.y += p.vy
        if (!p.subindo) {
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        }
        if (p.subindo && p.y < -10) {
            p.y = canvas.height + 10
            p.x = Math.random() * canvas.width
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.subindo ? "rgba(0, 212, 255, 1)" : "rgba(0, 212, 255, 0.6)"
        ctx.fill()
        if (p.subindo) {
            ctx.shadowBlur = 15
            ctx.shadowColor = "#00d4ff"
            ctx.fill()
            ctx.shadowBlur = 0
        }
    })
    for (var i = 0; i < particulas.length; i++) {
        for (var j = i + 1; j < particulas.length; j++) {
            var dx = particulas[i].x - particulas[j].x
            var dy = particulas[i].y - particulas[j].y
            var dist = Math.sqrt(dx*dx + dy*dy)
            if (dist < 120) {
                ctx.beginPath()
                ctx.moveTo(particulas[i].x, particulas[i].y)
                ctx.lineTo(particulas[j].x, particulas[j].y)
                ctx.strokeStyle = "rgba(0, 212, 255, " + (1 - dist/120) * 0.15 + ")"
                ctx.stroke()
            }
        }
    }
    requestAnimationFrame(animarParticulas)
}
animarParticulas()

// DIGITACAO
// as frases vem de TRADUCOES.inicio.frases (definidas no aplicarIdioma)
var frases = []
var fraseAtual = 0, letraAtual = 0, apagando = false
function digitar() {
    var el = document.getElementById("typing")
    if (!el || !frases.length) return  // pagina sem o texto que se digita
    var frase = frases[fraseAtual]
    if (!apagando) {
        el.innerText = frase.substring(0, letraAtual + 1)
        letraAtual++
        if (letraAtual === frase.length) {
            apagando = true
            setTimeout(digitar, 2000)
            return
        }
    } else {
        el.innerText = frase.substring(0, letraAtual - 1)
        letraAtual--
        if (letraAtual === 0) {
            apagando = false
            fraseAtual = (fraseAtual + 1) % frases.length
        }
    }
    setTimeout(digitar, apagando ? 50 : 100)
}

// ===== IDIOMAS =====
// Como funciona:
// - No HTML, cada texto traduzivel tem uma etiqueta com a chave da traducao:
//     data-i18n="grupo.chave"              -> troca o texto
//     data-i18n-html="grupo.chave"         -> troca o HTML (ex.: slogan com <span> azul)
//     data-i18n-placeholder="grupo.chave"  -> troca o placeholder
//     data-i18n-aria-label="grupo.chave"   -> troca o aria-label
// - O ESPANHOL fica so no HTML: ao abrir a pagina, guardamos o original para voltar ao ES.
// - PT e EN ficam em static/js/traducoes/<grupo>.js (TRADUCOES.grupo.pt / .en).
// - Textos que so existem no JavaScript (ex.: "ENVIANDO...") tem tambem .es no arquivo.
var IDIOMAS = ["es", "pt", "en"]
var ATRIBUTOS_I18N = ["placeholder", "aria-label"]

// nome da marca e do autor: vem do meu_site.py, pelos atributos data-marca e data-autor do <body>
var MARCA = document.body.dataset.marca
var AUTOR = document.body.dataset.autor
function comMarca(texto) {
    return texto.split("{marca}").join(MARCA).split("{autor}").join(AUTOR)
}

// procura a traducao "grupo.chave" no idioma pedido (null se nao existir)
function buscarTraducao(chave, idioma) {
    var partes = chave.split(".")
    var grupo = window.TRADUCOES && TRADUCOES[partes[0]]
    var valor = grupo && grupo[idioma] && grupo[idioma][partes[1]]
    if (valor === undefined) return null
    return typeof valor === "string" ? comMarca(valor) : valor
}

// texto que so existe no JavaScript (precisa dos 3 idiomas no arquivo de traducao)
function textoJS(chave) {
    var idioma = document.documentElement.lang
    var valor = buscarTraducao(chave, idioma)
    if (valor === null) valor = buscarTraducao(chave, "es")
    return valor === null ? "" : valor
}

// guarda o espanhol original de cada elemento etiquetado
var originais = []
document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-aria-label]").forEach(function(el) {
    var original = { el: el, atributos: {} }
    if (el.hasAttribute("data-i18n")) original.texto = el.textContent
    if (el.hasAttribute("data-i18n-html")) original.html = el.innerHTML
    ATRIBUTOS_I18N.forEach(function(atributo) {
        if (el.hasAttribute("data-i18n-" + atributo)) original.atributos[atributo] = el.getAttribute(atributo)
    })
    originais.push(original)
})

// devolve a traducao; se faltar, avisa no console e mantem o espanhol
function traduzir(chave, idioma, espanhol) {
    if (idioma === "es") return espanhol
    var valor = buscarTraducao(chave, idioma)
    if (valor === null) {
        console.warn("Traducao faltando (" + idioma + "): " + chave)
        return espanhol
    }
    return valor
}

function aplicarIdioma(idioma) {
    if (IDIOMAS.indexOf(idioma) === -1) idioma = "es"  // valor estranho salvo: usa espanhol
    try { localStorage.setItem("idioma", idioma) } catch (e) {}  // modo anonimo pode bloquear
    document.documentElement.lang = idioma

    // marca o idioma ativo no seletor (cor + linha + aria-current para leitor de tela)
    document.querySelectorAll(".idioma-btn").forEach(function(botao) {
        var ativo = botao.getAttribute("data-idioma") === idioma
        botao.classList.toggle("ativo", ativo)
        if (ativo) botao.setAttribute("aria-current", "true")
        else botao.removeAttribute("aria-current")
    })

    // troca todos os textos etiquetados da pagina
    originais.forEach(function(o) {
        var el = o.el
        if ("texto" in o) el.textContent = traduzir(el.getAttribute("data-i18n"), idioma, o.texto)
        if ("html" in o) el.innerHTML = traduzir(el.getAttribute("data-i18n-html"), idioma, o.html)
        Object.keys(o.atributos).forEach(function(atributo) {
            el.setAttribute(atributo, traduzir(el.getAttribute("data-i18n-" + atributo), idioma, o.atributos[atributo]))
        })
    })

    // frases do topo: troca a lista e recomeca a digitacao do zero
    if (document.getElementById("typing")) {
        frases = buscarTraducao("inicio.frases", idioma) || []
        fraseAtual = 0
        letraAtual = 0
        apagando = false
        document.getElementById("typing").innerText = ""
    }

    // avisa as paginas que o idioma mudou: document.addEventListener("idioma", ...)
    document.dispatchEvent(new CustomEvent("idioma", { detail: idioma }))
}

var idiomaSalvo = "es"
try { idiomaSalvo = localStorage.getItem("idioma") || "es" } catch (e) {}
aplicarIdioma(idiomaSalvo)
digitar()

// SELETOR DE IDIOMA: <button> ja funciona com clique, Tab, Enter e Espaco
document.querySelectorAll(".idioma-btn").forEach(function(botao) {
    botao.addEventListener("click", function() {
        aplicarIdioma(botao.getAttribute("data-idioma"))
    })
})

// FORMULARIO: envia por fetch (sem sair do site) e vai para /obrigado
var formContato = document.getElementById("form-contato")
var botaoEnviar = document.getElementById("btn-enviar")
var erroEnvio = document.getElementById("form-erro")
var textoBotaoEnviar = ""

// vindo de /servicios (ex.: /contacto?tipo=tienda), ja marca o "Tipo de proyecto"
if (formContato) {
    var tipoPedido = new URLSearchParams(location.search).get("tipo")
    var opcaoTipo = tipoPedido && formContato.querySelector('option[data-tipo="' + tipoPedido + '"]')
    if (opcaoTipo) opcaoTipo.selected = true
}

function reativarBotaoEnviar() {
    if (!botaoEnviar || !botaoEnviar.disabled) return
    botaoEnviar.disabled = false
    botaoEnviar.textContent = textoBotaoEnviar
}

if (formContato) formContato.addEventListener("submit", function(e) {
    e.preventDefault()
    erroEnvio.hidden = true
    textoBotaoEnviar = botaoEnviar.textContent  // "ENVIAR MENSAJE" no idioma atual
    botaoEnviar.disabled = true
    botaoEnviar.textContent = textoJS("contacto.enviando")

    fetch(formContato.action, {
        method: "POST",
        body: new FormData(formContato),
        headers: { "Accept": "application/json" }
    }).then(function(resposta) {
        if (!resposta.ok) throw new Error("Formspree respondeu " + resposta.status)
        formContato.reset()
        window.location.href = "/obrigado"
    }).catch(function() {
        // sem internet, Formspree fora do ar ou envio recusado
        erroEnvio.textContent = textoJS("contacto.erro")
        erroEnvio.hidden = false
        reativarBotaoEnviar()
    })
})

// se a mensagem de erro estiver visivel e o idioma mudar, traduz a mensagem
document.addEventListener("idioma", function() {
    if (erroEnvio && !erroEnvio.hidden) erroEnvio.textContent = textoJS("contacto.erro")
})

// SIMBOLOS </> SUBINDO (canvas separado; os pontinhos continuam iguais)
var canvasSimbolos = document.getElementById("canvas-simbolos")
var ctxSimbolos = canvasSimbolos.getContext("2d")
canvasSimbolos.width = window.innerWidth
canvasSimbolos.height = window.innerHeight
var simbolos = []

function sortear(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo)
}

// sorteia a camada (longe / medio / perto) pela chance de cada uma
function sortearDistancia() {
    var r = Math.random(), acumulado = 0
    for (var i = 0; i < CAMADAS.length; i++) {
        acumulado += CAMADAS[i].chance
        if (r < acumulado) return sortear(CAMADAS[i].distancia[0], CAMADAS[i].distancia[1])
    }
    return 1
}

function criarSimbolo() {
    if (simbolos.length < MAX_SIMBOLOS) {
        // d: 0 = perto, 1 = bem longe. Quanto maior, menor/desfocado/apagado/lento
        var d = sortearDistancia() * PROFUNDIDADE
        simbolos.push({
            distancia: d,
            x: sortear(30, canvasSimbolos.width - 30),
            y: canvasSimbolos.height + 30,
            vx: sortear(-0.15, 0.15) * (1 - 0.6 * d),
            vy: -sortear(1, 1.6) * (1 - 0.6 * d),            // longe: ate 60% mais lento
            tamanho: sortear(TAMANHO_SIMBOLO[0], TAMANHO_SIMBOLO[1]) * (1 - 0.5 * d),  // longe: metade do tamanho
            desfoque: 1.2 * d,                                // longe: blur de ate 1.2px
            brilho: BRILHO_SIMBOLO * (1 - 0.6 * d),           // longe: bem mais apagado
            halo: 10 * (1 - 0.6 * d)                          // longe: brilho neon mais curto
        })
        // desenha os de longe primeiro, para os de perto passarem na frente
        simbolos.sort(function(a, b) { return b.distancia - a.distancia })
    }
    var espera = sortear(INTERVALO_SIMBOLO[0], INTERVALO_SIMBOLO[1])
    if (window.innerWidth <= 768) espera *= INTERVALO_CELULAR
    setTimeout(criarSimbolo, espera)
}

// desenha </> com as mesmas linhas do favicon (desenho original de 44 x 32)
function desenharSimbolo(s, opacidade) {
    var escala = s.tamanho / 44
    ctxSimbolos.save()
    ctxSimbolos.translate(s.x - 22 * escala, s.y - 16 * escala)
    ctxSimbolos.scale(escala, escala)
    ctxSimbolos.globalAlpha = opacidade
    ctxSimbolos.strokeStyle = "#00d4ff"
    ctxSimbolos.lineWidth = 5
    ctxSimbolos.lineCap = "round"
    ctxSimbolos.lineJoin = "round"
    ctxSimbolos.shadowColor = "#00d4ff"
    ctxSimbolos.shadowBlur = s.halo / escala  // brilho suave (mais curto nos distantes)
    ctxSimbolos.filter = s.desfoque > 0.1 ? "blur(" + s.desfoque + "px)" : "none"
    ctxSimbolos.beginPath()
    ctxSimbolos.moveTo(12, 4);  ctxSimbolos.lineTo(0, 16);  ctxSimbolos.lineTo(12, 28)
    ctxSimbolos.moveTo(32, 4);  ctxSimbolos.lineTo(44, 16); ctxSimbolos.lineTo(32, 28)
    ctxSimbolos.moveTo(26, 0);  ctxSimbolos.lineTo(18, 32)
    ctxSimbolos.stroke()
    ctxSimbolos.restore()
}

function animarSimbolos() {
    ctxSimbolos.clearRect(0, 0, canvasSimbolos.width, canvasSimbolos.height)
    var zonaFade = canvasSimbolos.height * 0.35  // some aos poucos no terco de cima
    simbolos = simbolos.filter(function(s) {
        s.x += s.vx
        s.y += s.vy
        var opacidade = s.brilho * Math.max(0, Math.min(1, s.y / zonaFade))
        if (opacidade <= 0) return false  // chegou ao topo: remove
        desenharSimbolo(s, opacidade)
        return true
    })
    requestAnimationFrame(animarSimbolos)
}

// quem pede "reduzir movimento" no sistema nao ve os simbolos
if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(criarSimbolo, 1500)
    animarSimbolos()
}

window.addEventListener("resize", function() {
    canvasSimbolos.width = window.innerWidth
    canvasSimbolos.height = window.innerHeight
})

// se o visitante voltar da pagina /obrigado com o botao "Voltar", reativa o botao
window.addEventListener("pageshow", reativarBotaoEnviar)

window.addEventListener("resize", function() {
    var larguraAntiga = canvas.width, alturaAntiga = canvas.height
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particulas.forEach(function(p) {
        p.x = p.x / larguraAntiga * canvas.width
        p.y = p.y / alturaAntiga * canvas.height
    })
})
