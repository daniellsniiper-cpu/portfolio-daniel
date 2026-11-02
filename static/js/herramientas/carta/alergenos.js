// OS 14 ALERGENOS OBRIGATORIOS NA UE (Reglamento UE 1169/2011)
// Icones proprios dev_mot4 (aprovados em design/alergenos.png): viewBox 0 0 48 48, traco "currentColor".
// Usados na previa (HTML) e no PDF (pdfmake), sempre a partir daqui.
var CARTA = window.CARTA || {}

CARTA.ALERGENOS = [
    { id: "gluten", desenho: '<path d="M24 40 V11"/><ellipse cx="20" cy="17" rx="2.6" ry="5" transform="rotate(-35 20 17)"/><ellipse cx="28" cy="17" rx="2.6" ry="5" transform="rotate(35 28 17)"/><ellipse cx="20" cy="24" rx="2.6" ry="5" transform="rotate(-35 20 24)"/><ellipse cx="28" cy="24" rx="2.6" ry="5" transform="rotate(35 28 24)"/><ellipse cx="20" cy="31" rx="2.6" ry="5" transform="rotate(-35 20 31)"/><ellipse cx="28" cy="31" rx="2.6" ry="5" transform="rotate(35 28 31)"/>' },
    { id: "crustaceos", desenho: '<ellipse cx="24" cy="29" rx="8.5" ry="5.5"/><path d="M18 25 C 14 22, 12 18, 14 14 M14 14 L11.5 12 M14 14 L16.5 11.5"/><path d="M30 25 C 34 22, 36 18, 34 14 M34 14 L36.5 12 M34 14 L31.5 11.5"/><path d="M16.5 31 L12 34 M18 33.5 L14.5 37.5 M31.5 31 L36 34 M30 33.5 L33.5 37.5"/><path d="M21.5 23.8 V20.5 M26.5 23.8 V20.5"/>' },
    { id: "huevos", desenho: '<path d="M24 11 C 17.5 11, 14 21, 14 28 C 14 34, 18.5 38, 24 38 C 29.5 38, 34 34, 34 28 C 34 21, 30.5 11, 24 11 Z"/>' },
    { id: "pescado", desenho: '<path d="M11 24 C 16 16.5, 28 16.5, 33 24 C 28 31.5, 16 31.5, 11 24 Z"/><path d="M33 24 L39 18.5 V29.5 Z"/><circle cx="17.5" cy="22.5" r="1.3" fill="currentColor"/>' },
    { id: "cacahuetes", desenho: '<path d="M24 10.5 C 30 10.5, 32 16.5, 29 20.5 C 27.3 22.6, 27.3 25.4, 29 27.5 C 32 31.5, 30 37.5, 24 37.5 C 18 37.5, 16 31.5, 19 27.5 C 20.7 25.4, 20.7 22.6, 19 20.5 C 16 16.5, 18 10.5, 24 10.5 Z"/><circle cx="22.3" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="25.7" cy="17.8" r="1" fill="currentColor" stroke="none"/><circle cx="22.3" cy="30.2" r="1" fill="currentColor" stroke="none"/><circle cx="25.7" cy="32.5" r="1" fill="currentColor" stroke="none"/>' },
    { id: "soja", desenho: '<path d="M13 33 C 13 22, 24 13, 35 14 C 36 25, 26 35, 13 33 Z"/><circle cx="19" cy="28.5" r="2.6"/><circle cx="24.2" cy="23.6" r="2.6"/><circle cx="29.4" cy="18.7" r="2.6"/>' },
    { id: "lacteos", desenho: '<path d="M20 11.5 H28 V16.5 L31 20.5 V36 C 31 37.2, 30.2 38, 29 38 H19 C 17.8 38, 17 37.2, 17 36 V20.5 L20 16.5 Z"/><path d="M17 27 H31"/>' },
    { id: "frutos_cascara", desenho: '<path d="M13.5 22 C 13.5 15, 34.5 15, 34.5 22 Z"/><path d="M16 22 C 16 31, 21 36, 24 38 C 27 36, 32 31, 32 22"/><path d="M24 15.8 V11"/>' },
    { id: "apio", desenho: '<path d="M20.5 39 C 20.5 31, 21.5 24, 23 19 M27.5 39 C 27.5 31, 26.5 24, 25 19 M20.5 39 H27.5"/><path d="M0 -5 C 2.6 -2.5, 2.6 2.5, 0 5 C -2.6 2.5, -2.6 -2.5, 0 -5 Z" transform="translate(24 13) "/><path d="M0 -5 C 2.6 -2.5, 2.6 2.5, 0 5 C -2.6 2.5, -2.6 -2.5, 0 -5 Z" transform="translate(19 15.5) rotate(-45)"/><path d="M0 -5 C 2.6 -2.5, 2.6 2.5, 0 5 C -2.6 2.5, -2.6 -2.5, 0 -5 Z" transform="translate(29 15.5) rotate(45)"/>' },
    { id: "mostaza", desenho: '<path d="M15 21.5 H33 V34.5 C 33 36.7, 31.2 38.5, 29 38.5 H19 C 16.8 38.5, 15 36.7, 15 34.5 Z"/><path d="M13.5 18 H34.5 V21.5 H13.5 Z"/><path d="M15 29 H33"/><path d="M26 18 L32.5 9.5"/><ellipse cx="33.6" cy="8.2" rx="1.9" ry="1.4" transform="rotate(-52 33.6 8.2)"/>' },
    { id: "sesamo", desenho: '<path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(17 18) rotate(-30)"/><path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(26.5 15) rotate(20)"/><path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(33 23) rotate(65)"/><path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(18.5 29) rotate(-70)"/><path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(27.5 27.5) rotate(10)"/><path d="M0 -4.2 C 2.4 -1.5, 2.4 2.8, 0 3.8 C -2.4 2.8, -2.4 -1.5, 0 -4.2 Z" transform="translate(23.5 35.5) rotate(-15)"/>' },
    { id: "sulfitos", desenho: '<path d="M16.5 11.5 H31.5 C 31.5 20.5, 28.5 25, 24 25 C 19.5 25, 16.5 20.5, 16.5 11.5 Z"/><path d="M17.2 17 H30.8"/><path d="M24 25 V35.5 M18 36 H30"/>' },
    { id: "altramuces", desenho: '<ellipse cx="18" cy="20" rx="6" ry="4.8" transform="rotate(-20 18 20)"/><path d="M14.8 18.8 C 15.8 17.6, 17.4 17.2, 18.6 17.6"/><ellipse cx="30.5" cy="21" rx="6" ry="4.8" transform="rotate(15 30.5 21)"/><path d="M27.6 18.8 C 28.8 18, 30.4 18, 31.6 18.8"/><ellipse cx="24" cy="31.5" rx="6" ry="4.8"/><path d="M20.6 29.8 C 21.8 28.8, 23.6 28.6, 24.8 29.2"/>' },
    { id: "moluscos", desenho: '<path d="M24 36 L12 22.5 C 14 14, 34 14, 36 22.5 Z"/><path d="M24 36 L16.5 17.5 M24 36 L20.2 15.5 M24 36 V14.8 M24 36 L27.8 15.5 M24 36 L31.5 17.5"/><path d="M20.5 36 H27.5 V39.5 H20.5 Z"/>' }
]

// nomes oficiais, no idioma escolhido para a carta (legenda do PDF) e no idioma da interface (editor)
CARTA.NOMES_ALERGENOS = {
    es: { gluten: "Gluten", crustaceos: "Crustáceos", huevos: "Huevos", pescado: "Pescado", cacahuetes: "Cacahuetes", soja: "Soja", lacteos: "Lácteos",
          frutos_cascara: "Frutos de cáscara", apio: "Apio", mostaza: "Mostaza", sesamo: "Sésamo", sulfitos: "Sulfitos", altramuces: "Altramuces", moluscos: "Moluscos" },
    pt: { gluten: "Glúten", crustaceos: "Crustáceos", huevos: "Ovos", pescado: "Peixe", cacahuetes: "Amendoins", soja: "Soja", lacteos: "Leite",
          frutos_cascara: "Frutos de casca rija", apio: "Aipo", mostaza: "Mostarda", sesamo: "Sésamo", sulfitos: "Sulfitos", altramuces: "Tremoço", moluscos: "Moluscos" },
    en: { gluten: "Gluten", crustaceos: "Crustaceans", huevos: "Eggs", pescado: "Fish", cacahuetes: "Peanuts", soja: "Soya", lacteos: "Milk",
          frutos_cascara: "Tree nuts", apio: "Celery", mostaza: "Mustard", sesamo: "Sesame", sulfitos: "Sulphites", altramuces: "Lupin", moluscos: "Molluscs" }
}

// SVG completo de um alergeno, na cor pedida (o PDF nao entende "currentColor", entao trocamos pela cor)
CARTA.svgAlergeno = function (id, cor) {
    var a = CARTA.ALERGENOS.filter(function (x) { return x.id === id })[0]
    if (!a) return ""
    var c = cor || "currentColor"
    return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="' + c +
        '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="21.5" stroke-width="2"/>' +
        a.desenho.split("currentColor").join(c) + '</svg>'
}
