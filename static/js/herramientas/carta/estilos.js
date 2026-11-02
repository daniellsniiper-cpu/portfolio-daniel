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
    "Montserrat SemiBold": { normal: "Montserrat-SemiBold.ttf", bold: "Montserrat-Bold.ttf", italics: "Montserrat-SemiBold.ttf", bolditalics: "Montserrat-Bold.ttf" },
    "Jost":             { normal: "Jost-Regular.ttf", bold: "Jost-Medium.ttf", italics: "Jost-Regular.ttf", bolditalics: "Jost-Medium.ttf" },
    "Jost Light":       { normal: "Jost-Light.ttf", bold: "Jost-Regular.ttf", italics: "Jost-Light.ttf", bolditalics: "Jost-Regular.ttf" },
    "Source Serif":     { normal: "SourceSerif4-Regular.ttf", bold: "SourceSerif4-SemiBold.ttf", italics: "SourceSerif4-Italic.ttf", bolditalics: "SourceSerif4-SemiBold.ttf" },
    "Oswald":           { normal: "Oswald-Medium.ttf", bold: "Oswald-SemiBold.ttf", italics: "Oswald-Medium.ttf", bolditalics: "Oswald-SemiBold.ttf" },
    "EB Garamond":      { normal: "EBGaramond-Medium.ttf", bold: "EBGaramond-SemiBold.ttf", italics: "EBGaramond-MediumItalic.ttf", bolditalics: "EBGaramond-MediumItalic.ttf" }
}

// Tokens opcionais (com valor padrao quando faltam):
//   fonteNegocio (= fonteTitulo), negocioNegrito (= true), fonteItem (= fonteTexto), fonteDescricao (= fonteTexto),
//   categoria.italico (= false), filete: "centro" | "barra" | "linha" | "ornamento",
//   cores.extra (= suave), extraItalico (= false), tam.extra (= descricao), moldura (= false: moldura dourada na pagina),
//   filete "lateral" (barra de cor a esquerda do titulo da categoria), pontilhado (= false: linha de pontos do nome ate o preco)

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
        icone: 12.5   // tamanho dos icones de alergenos (pt)
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
        icone: 12
    },

    // LISTA DE SERVICIOS
    minimalista: {
        alinhamento: "left",
        fonteTitulo: "Jost",                // categorias em Jost Medium
        fonteNegocio: "Jost Light", negocioNegrito: false,
        fonteTexto: "Jost",                 // descricoes em Jost Regular (a Light ficava fina demais impressa)
        cores: { texto: "#222222", suave: "#555555", acento: "#333333", linha: "#d9d9d9", icones: "#333333" },   // suave #555 = contraste 7,5:1 no branco
        tam: { negocio: 26, contato: 9, categoria: 10.5, item: 11, preco: 11, descricao: 9, legenda: 8, extra: 9.5 },
        categoria: { caixaAlta: true, espacamento: 3, negrito: true, filete: "linha" },        // linha fina de ponta a ponta
        item: { nomeNegrito: false, precoNegrito: false, precoAcento: false, descricaoItalico: false },
        icone: 12
    },
    lujo: {
        alinhamento: "center",
        fonteTitulo: "EB Garamond",          // EB Garamond: a Cormorant desenhava alguns acentos tortos (è, û)
        fonteTexto: "EB Garamond",
        fonteDescricao: "Jost",             // descricoes em Jost Regular (a Light ficava fina demais impressa)
        cores: { texto: "#2b2620", suave: "#555555", acento: "#9a7b3f", linha: "#cdb88a", icones: "#9a7b3f", extra: "#9a7b3f", moldura: "#b89a5e" },
        tam: { negocio: 30, contato: 9, categoria: 17, item: 13, preco: 13, descricao: 8.5, legenda: 8, extra: 11 },
        categoria: { caixaAlta: false, italico: true, espacamento: 0.5, negrito: false, filete: "ornamento" },  // linha + losango + linha
        item: { nomeNegrito: true, precoNegrito: true, precoAcento: false, descricaoItalico: false },
        extraItalico: true,
        moldura: true,   // moldura dupla dourada e fina (fundo continua branco)
        icone: 12.5
    },

    // LISTA DE PRECIOS
    clasico: {
        alinhamento: "center",
        fonteTitulo: "Source Serif",
        fonteTexto: "Source Serif",
        fonteDescricao: "Lato",
        cores: { texto: "#1f1f1f", suave: "#555555", acento: "#7a2e2e", linha: "#8c8c8c", icones: "#7a2e2e" },   // acento bordo, 9,3:1
        tam: { negocio: 26, contato: 9, categoria: 12.5, item: 11, preco: 11, descricao: 9, legenda: 8, extra: 9.5 },
        categoria: { caixaAlta: true, espacamento: 2, negrito: true, filete: "centro" },
        item: { nomeNegrito: false, precoNegrito: true, precoAcento: false, descricaoItalico: false },
        pontilhado: true,   // Camiseta .......... S–XL  15,00 €
        icone: 12
    },
    destacado: {
        alinhamento: "left",
        fonteTitulo: "Oswald",
        fonteTexto: "Lato",
        cores: { texto: "#1e1e1e", suave: "#555555", acento: "#c2410c", linha: "#dddddd", icones: "#c2410c" },   // acento laranja, 5,2:1
        tam: { negocio: 28, contato: 9, categoria: 14, item: 11, preco: 11.5, descricao: 9, legenda: 8, extra: 9 },
        categoria: { caixaAlta: true, espacamento: 1.5, negrito: true, filete: "lateral" },   // barra de cor fina a esquerda do titulo
        item: { nomeNegrito: true, precoNegrito: true, precoAcento: true, descricaoItalico: false },
        icone: 12
    }
}

// fontes que um estilo usa (para carregar so o necessario no PDF)
CARTA.fontesDoEstilo = function (estilo) {
    var e = CARTA.ESTILOS[estilo], lista = [e.fonteTitulo, e.fonteTexto]
    ;[e.fonteItem, e.fonteNegocio, e.fonteDescricao].forEach(function (f) { if (f) lista.push(f) })
    return lista.filter(function (f, i) { return lista.indexOf(f) === i })
}
