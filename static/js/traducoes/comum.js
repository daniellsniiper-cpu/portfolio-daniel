// TRADUCOES COMUNS a todas as paginas: menu, seletor de idioma e rodape.
// So PT e EN: o espanhol fica no proprio HTML (o main.js guarda o original).
// {marca} e {autor} sao trocados pelos nomes definidos no meu_site.py.
// Uso no HTML: data-i18n="comum.navInicio"
var TRADUCOES = window.TRADUCOES || {}

TRADUCOES.comum = {
    pt: {
        navInicio: "INÍCIO",
        navNosotros: "SOBRE",
        navContacto: "CONTATO",
        grupoIdiomas: "Idioma",
        instagramAria: "Instagram da {marca}",
        footerLocal: "MADRID, ESPANHA"
    },
    en: {
        navInicio: "HOME",
        navNosotros: "ABOUT",
        navContacto: "CONTACT",
        grupoIdiomas: "Language",
        instagramAria: "{marca} on Instagram",
        footerLocal: "MADRID, SPAIN"
    }
}
