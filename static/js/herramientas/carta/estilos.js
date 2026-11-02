// ESTILOS DA CARTA: cores, fontes e tamanhos de cada estilo.
// Um unico lugar para a PREVIA (HTML) e para o PDF (pdfmake): assim os dois ficam iguais.
// Tamanhos em pontos (pt), como no PDF; a previa converte para pixels.
// Regra: nenhum estilo com fundo escuro ou cheio (os clientes imprimem).
var CARTA = window.CARTA || {}

// arquivos de fonte (em static/fonts/carta/). Cada familia precisa de normal/bold/italics/bolditalics no pdfmake.
CARTA.FONTES = {
    "Playfair Display": { normal: "PlayfairDisplay-Regular.ttf", bold: "PlayfairDisplay-Bold.ttf", italics: "PlayfairDisplay-Italic.ttf", bolditalics: "PlayfairDisplay-Bold.ttf" },
    "Lato":             { normal: "Lato-Regular.ttf", bold: "Lato-Bold.ttf", italics: "Lato-Italic.ttf", bolditalics: "Lato-Bold.ttf" },
    "Montserrat":       { normal: "Montserrat-Regular.ttf", bold: "Montserrat-Bold.ttf", italics: "Montserrat-Regular.ttf", bolditalics: "Montserrat-Bold.ttf" },
    "Montserrat SemiBold": { normal: "Montserrat-SemiBold.ttf", bold: "Montserrat-Bold.ttf", italics: "Montserrat-SemiBold.ttf", bolditalics: "Montserrat-Bold.ttf" }
}

CARTA.ESTILOS = {
    // CARTA / MENU
    elegante: {
        alinhamento: "center",           // cabecalho e categorias centralizados
        fonteTitulo: "Playfair Display", // nome do negocio e categorias
        fonteTexto: "Lato",              // itens, descricoes, contato
        cores: { texto: "#2b2b2b", suave: "#666666", acento: "#8a6a2f", linha: "#c9b48a", icones: "#8a6a2f" },
        tam: { negocio: 26, contato: 9.5, categoria: 14, item: 11, preco: 11, descricao: 9.5, legenda: 8.5 },
        categoria: { caixaAlta: true, espacamento: 2.5, negrito: false, filete: "centro" },   // filete dourado curto embaixo
        item: { nomeNegrito: true, precoNegrito: true, precoAcento: false, descricaoItalico: true },
        icone: 10   // tamanho dos icones de alergenos (pt)
    },
    moderno: {
        alinhamento: "left",
        fonteTitulo: "Montserrat",
        fonteTexto: "Montserrat",
        fonteItem: "Montserrat SemiBold",
        cores: { texto: "#222222", suave: "#5f6670", acento: "#1f4e79", linha: "#cfd8e3", icones: "#1f4e79" },
        tam: { negocio: 24, contato: 9, categoria: 11.5, item: 10.5, preco: 10.5, descricao: 9, legenda: 8 },
        categoria: { caixaAlta: true, espacamento: 1.5, negrito: true, filete: "barra" },     // barra de cor curta embaixo, a esquerda
        item: { nomeNegrito: false, precoNegrito: true, precoAcento: true, descricaoItalico: false },
        icone: 9.5
    }
}

// fontes que um estilo usa (para carregar so o necessario no PDF)
CARTA.fontesDoEstilo = function (estilo) {
    var e = CARTA.ESTILOS[estilo], lista = [e.fonteTitulo, e.fonteTexto]
    if (e.fonteItem) lista.push(e.fonteItem)
    return lista.filter(function (f, i) { return lista.indexOf(f) === i })
}
