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
// as frases vem de textos[idioma].frases (definidas no aplicarIdioma)
var frases = []
var fraseAtual = 0, letraAtual = 0, apagando = false
function digitar() {
    var frase = frases[fraseAtual]
    var el = document.getElementById("typing")
    if (!el) return  // pagina sem o texto que se digita
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

// BARRAS
setTimeout(function() {
    document.querySelectorAll(".barra-progresso").forEach(function(b) {
        b.style.width = b.getAttribute("data-width") + "%"
    })
}, 500)

// IDIOMAS
// nome da marca e do autor: vem do meu_site.py (um lugar so)
// (o valor vem do meu_site.py, pelos atributos data-marca e data-autor do <body>)
var MARCA = document.body.dataset.marca
var AUTOR = document.body.dataset.autor
function comMarca(texto) {
    return texto.split("{marca}").join(MARCA).split("{autor}").join(AUTOR)
}

var textos = {
    pt: {
        frases: ["Sites que vendem", "Lojas online e apps", "Automação com IA", "Sua ideia. Nossa tecnologia."],
        navInicio: "INÍCIO", navSobre: "SOBRE", navHab: "HABILIDADES", navProj: "PROJETOS", navCont: "CONTATO",
        btnProjetos: "Ver Projetos", btnContato: "Entre em Contato",
        sobreTitulo: "SOBRE NÓS", sobreP1: "{marca} é uma marca de desenvolvimento tecnológico em Madrid. Criamos soluções digitais modernas e sob medida: sites, apps, lojas online, sistemas de gestão e automação com IA.",
        sobreP2: "Sou {autor}, fundador da {marca}. Atendo pessoalmente cada projeto porque os melhores resultados nascem de ouvir de perto cada cliente e entender o seu negócio.",
        stat1: "PROJETOS", stat2: "IDIOMAS", stat3: "EMPRESA",
        habTitulo: "HABILIDADES", projTitulo: "PROJETOS",
        proj1Titulo: "STUDIO LARA MARQUES", proj1Desc: "Sistema completo de agendamento online com área administrativa, 3 idiomas e assistente virtual com IA integrada.",
        proj2Titulo: "PORTFÓLIO {marca}", proj2Desc: "Site portfólio profissional estilo JARVIS com animações, 3 idiomas e deploy na internet.",
        proj3Titulo: "EM BREVE", proj3Desc: "Novo projeto em desenvolvimento. Fique atento às novidades da {marca}.",
        contTitulo: "CONTATO", contDesc: "Tem um projeto em mente? Vamos conversar e transformar sua ideia em realidade digital.",
        statusTxt: "Disponível para projetos",
        inputNome: "SEU NOME", inputEmail: "SEU EMAIL", inputMsg: "SUA MENSAGEM...",
        btnEnviar: "ENVIAR MENSAGEM", slogan: ["IDEIAS", "CÓDIGO", "RESULTADOS"], assinatura: "por {autor}",
        filosofiaLabel: "NOSSA FILOSOFIA", filosofiaTxt: "Ouvir, criar e trabalhar com compromisso em cada projeto.",
        instagramAria: "Instagram da {marca}", grupoIdiomas: "Idioma",
        secaoLabel: "SISTEMA", projNum: "PROJETO", labelLocal: "LOCAL", labelStatus: "STATUS",
        localTxt: "Madrid, Espanha", footerLocal: "MADRID, ESPANHA",
        btnEnviando: "ENVIANDO...", erroEnvio: "Não foi possível enviar a mensagem. Tente novamente em alguns minutos."
    },
    es: {
        frases: ["Páginas web que venden", "Tiendas online y apps", "Automatización con IA", "Tu idea. Nuestra tecnología."],
        navInicio: "INICIO", navSobre: "NOSOTROS", navHab: "HABILIDADES", navProj: "PROYECTOS", navCont: "CONTACTO",
        btnProjetos: "Ver Proyectos", btnContato: "Contáctame",
        sobreTitulo: "SOBRE NOSOTROS", sobreP1: "{marca} es una marca de desarrollo tecnológico en Madrid. Creamos soluciones digitales modernas y a medida: páginas web, apps, tiendas online, sistemas de gestión y automatización con IA.",
        sobreP2: "Soy {autor}, fundador de {marca}. Atiendo personalmente cada proyecto porque los mejores resultados nacen de escuchar de cerca a cada cliente y entender su negocio.",
        stat1: "PROYECTOS", stat2: "IDIOMAS", stat3: "EMPRESA",
        habTitulo: "HABILIDADES", projTitulo: "PROYECTOS",
        proj1Titulo: "STUDIO LARA MARQUES", proj1Desc: "Sistema completo de reservas online con área administrativa, 3 idiomas y asistente virtual con IA integrada.",
        proj2Titulo: "PORTAFOLIO {marca}", proj2Desc: "Sitio portafolio profesional estilo JARVIS con animaciones, 3 idiomas y deploy en internet.",
        proj3Titulo: "PRÓXIMAMENTE", proj3Desc: "Nuevo proyecto en desarrollo. Mantente atento a las novedades de {marca}.",
        contTitulo: "CONTACTO", contDesc: "¿Tienes un proyecto en mente? Hablemos y transformemos tu idea en realidad digital.",
        statusTxt: "Disponible para proyectos",
        inputNome: "TU NOMBRE", inputEmail: "TU EMAIL", inputMsg: "TU MENSAJE...",
        btnEnviar: "ENVIAR MENSAJE", slogan: ["IDEAS", "CÓDIGO", "RESULTADOS"], assinatura: "por {autor}",
        filosofiaLabel: "NUESTRA FILOSOFÍA", filosofiaTxt: "Escuchar, crear y trabajar con compromiso en cada proyecto.",
        instagramAria: "Instagram de {marca}", grupoIdiomas: "Idioma",
        secaoLabel: "SISTEMA", projNum: "PROYECTO", labelLocal: "UBICACIÓN", labelStatus: "ESTADO",
        localTxt: "Madrid, España", footerLocal: "MADRID, ESPAÑA",
        btnEnviando: "ENVIANDO...", erroEnvio: "No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos."
    },
    en: {
        frases: ["Websites that sell", "Online stores & apps", "AI automation", "Your idea. Our technology."],
        navInicio: "HOME", navSobre: "ABOUT", navHab: "SKILLS", navProj: "PROJECTS", navCont: "CONTACT",
        btnProjetos: "See Projects", btnContato: "Contact Me",
        sobreTitulo: "ABOUT US", sobreP1: "{marca} is a technology development brand based in Madrid. We build modern, custom digital solutions: websites, apps, online stores, management systems and AI automation.",
        sobreP2: "I'm {autor}, founder of {marca}. I personally handle every project because the best results come from listening closely to each client and understanding their business.",
        stat1: "PROJECTS", stat2: "LANGUAGES", stat3: "COMPANY",
        habTitulo: "SKILLS", projTitulo: "PROJECTS",
        proj1Titulo: "STUDIO LARA MARQUES", proj1Desc: "Complete online booking system with admin area, 3 languages and AI virtual assistant.",
        proj2Titulo: "PORTFOLIO {marca}", proj2Desc: "Professional JARVIS-style portfolio with animations, 3 languages and internet deployment.",
        proj3Titulo: "COMING SOON", proj3Desc: "New project in development. Stay tuned for {marca} news.",
        contTitulo: "CONTACT", contDesc: "Have a project in mind? Let's talk and turn your idea into digital reality.",
        statusTxt: "Available for projects",
        inputNome: "YOUR NAME", inputEmail: "YOUR EMAIL", inputMsg: "YOUR MESSAGE...",
        btnEnviar: "SEND MESSAGE", slogan: ["IDEAS", "CODE", "RESULTS"], assinatura: "by {autor}",
        filosofiaLabel: "OUR PHILOSOPHY", filosofiaTxt: "Listen, create and work with commitment on every project.",
        instagramAria: "{marca} on Instagram", grupoIdiomas: "Language",
        secaoLabel: "SYSTEM", projNum: "PROJECT", labelLocal: "LOCATION", labelStatus: "STATUS",
        localTxt: "Madrid, Spain", footerLocal: "MADRID, SPAIN",
        btnEnviando: "SENDING...", erroEnvio: "The message could not be sent. Please try again in a few minutes."
    }
}

// helpers: cada pagina tem elementos diferentes; so altera o que existir
function definirTexto(id, valor) {
    var el = document.getElementById(id)
    if (el) el.innerText = valor
}
function definirAtributo(id, atributo, valor) {
    var el = document.getElementById(id)
    if (el) el.setAttribute(atributo, valor)
}

function aplicarIdioma(idioma) {
    if (!textos[idioma]) idioma = "es"  // valor estranho salvo: usa espanhol
    try { localStorage.setItem("idioma", idioma) } catch (e) {}  // modo anonimo pode bloquear
    var t = textos[idioma]
    document.documentElement.lang = idioma

    // marca o idioma ativo no seletor (cor + linha + aria-current para leitor de tela)
    document.querySelectorAll(".idioma-btn").forEach(function(botao) {
        var ativo = botao.getAttribute("data-idioma") === idioma
        botao.classList.toggle("ativo", ativo)
        if (ativo) botao.setAttribute("aria-current", "true")
        else botao.removeAttribute("aria-current")
    })
    definirAtributo("grupo-idiomas", "aria-label", t.grupoIdiomas)

    // troca as frases do topo e recomeca a digitacao do zero
    frases = t.frases
    fraseAtual = 0
    letraAtual = 0
    apagando = false
    definirTexto("typing", "")
    definirTexto("nav-inicio", t.navInicio)
    definirTexto("nav-sobre", t.navSobre)
    definirTexto("nav-hab", t.navHab)
    definirTexto("nav-projetos", t.navProj)
    definirTexto("nav-contato", t.navCont)
    definirTexto("btn-projetos", t.btnProjetos)
    definirTexto("btn-contato", t.btnContato)
    definirTexto("sobre-titulo", t.sobreTitulo)
    definirTexto("sobre-p1", comMarca(t.sobreP1))
    definirTexto("sobre-p2", comMarca(t.sobreP2))
    definirTexto("filosofia-label", t.filosofiaLabel)
    definirTexto("filosofia-txt", t.filosofiaTxt)
    definirTexto("stat1", t.stat1)
    definirTexto("stat2", t.stat2)
    definirTexto("stat3", t.stat3)
    definirTexto("hab-titulo", t.habTitulo)
    definirTexto("proj-titulo", t.projTitulo)
    definirTexto("proj1-titulo", t.proj1Titulo)
    definirTexto("proj1-desc", t.proj1Desc)
    definirTexto("proj2-titulo", comMarca(t.proj2Titulo))
    definirTexto("proj2-desc", t.proj2Desc)
    definirTexto("proj3-titulo", t.proj3Titulo)
    definirTexto("proj3-desc", comMarca(t.proj3Desc))
    definirTexto("cont-titulo", t.contTitulo)
    definirTexto("cont-desc", t.contDesc)
    definirTexto("status-txt", t.statusTxt)
    definirAtributo("input-nome", "placeholder", t.inputNome)
    definirAtributo("input-email", "placeholder", t.inputEmail)
    definirAtributo("input-msg", "placeholder", t.inputMsg)
    definirAtributo("input-nome", "aria-label", t.inputNome)
    definirAtributo("input-email", "aria-label", t.inputEmail)
    definirAtributo("input-msg", "aria-label", t.inputMsg)
    definirTexto("btn-enviar", t.btnEnviar)
    definirTexto("assinatura", comMarca(t.assinatura))
    definirAtributo("footer-instagram", "aria-label", comMarca(t.instagramAria))

    // slogan: palavras com as barras "/" em azul
    var slogan = document.getElementById("slogan")
    if (slogan) slogan.innerHTML = ""
    if (slogan) t.slogan.forEach(function(palavra, i) {
        if (i > 0) {
            var barra = document.createElement("span")
            barra.className = "barra"
            barra.innerText = "/"
            slogan.appendChild(barra)
        }
        slogan.appendChild(document.createTextNode(palavra))
    })
    definirTexto("sobre-label", t.secaoLabel + " — 001")
    definirTexto("hab-label", t.secaoLabel + " — 002")
    definirTexto("proj-label", t.secaoLabel + " — 003")
    definirTexto("cont-label", t.secaoLabel + " — 004")
    definirTexto("proj1-num", t.projNum + " — 001")
    definirTexto("proj2-num", t.projNum + " — 002")
    definirTexto("proj3-num", t.projNum + " — 003")
    definirTexto("label-local", t.labelLocal)
    definirTexto("label-status", t.labelStatus)
    definirTexto("local-txt", t.localTxt)
    definirTexto("footer-local", t.footerLocal)
    definirTexto("form-erro", t.erroEnvio)

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
if (formContato) formContato.addEventListener("submit", function(e) {
    e.preventDefault()
    var t = textos[document.documentElement.lang]
    var botao = document.getElementById("btn-enviar")
    var erro = document.getElementById("form-erro")
    erro.hidden = true
    botao.disabled = true
    botao.innerText = t.btnEnviando

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
        var t = textos[document.documentElement.lang]
        erro.innerText = t.erroEnvio
        erro.hidden = false
        botao.disabled = false
        botao.innerText = t.btnEnviar
    })
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
window.addEventListener("pageshow", function() {
    var botao = document.getElementById("btn-enviar")
    if (!botao) return
    botao.disabled = false
    botao.innerText = textos[document.documentElement.lang].btnEnviar
})

window.addEventListener("resize", function() {
    var larguraAntiga = canvas.width, alturaAntiga = canvas.height
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    particulas.forEach(function(p) {
        p.x = p.x / larguraAntiga * canvas.width
        p.y = p.y / alturaAntiga * canvas.height
    })
})
