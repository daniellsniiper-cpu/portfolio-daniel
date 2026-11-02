// MODOS DA FERRAMENTA: mesma estrutura de dados (categorias -> itens com nome, descricao e preco),
// cada modo com um campo extra e os seus estilos.
var CARTA = window.CARTA || {}

CARTA.MODOS = {
    carta:     { disponivel: true,  extra: "alergenos", estilos: ["elegante", "moderno"] },
    servicios: { disponivel: false, extra: "duracion",  estilos: [] },   // Parte 2
    precios:   { disponivel: false, extra: "referencia", estilos: [] }   // Parte 3
}

// textos fixos do PDF, no idioma escolhido para a carta (nao no idioma da interface)
CARTA.TEXTOS_PDF = {
    es: { alergenos: "Alérgenos", hechoCon: "Hecho con" },
    pt: { alergenos: "Alergénios", hechoCon: "Feito com" },
    en: { alergenos: "Allergens", hechoCon: "Made with" }
}

// conteudo de exemplo (primeira visita), no idioma da interface — para a previa nao comecar vazia
CARTA.exemplo = function (modo, idioma) {
    var ex = {
        es: { negocio: { nombre: "Café Aurora", direccion: "Calle Mayor 12, Madrid", telefono: "910 000 000" },
              categorias: [
                { nombre: "Desayunos", itens: [
                    { nombre: "Tostada con tomate", descripcion: "Pan de pueblo, tomate rallado y aceite de oliva virgen extra", precio: "2,80 €", extra: ["gluten"] },
                    { nombre: "Croissant a la plancha", descripcion: "Con mantequilla y mermelada", precio: "2,50 €", extra: ["gluten", "huevos", "lacteos"] } ] },
                { nombre: "Bebidas", itens: [
                    { nombre: "Café con leche", descripcion: "", precio: "1,60 €", extra: ["lacteos"] },
                    { nombre: "Zumo de naranja natural", descripcion: "", precio: "3,20 €", extra: [] } ] } ] },
        pt: { negocio: { nombre: "Café Aurora", direccion: "Rua Augusta 12, Lisboa", telefono: "210 000 000" },
              categorias: [
                { nombre: "Pequenos-almoços", itens: [
                    { nombre: "Tosta com tomate", descripcion: "Pão rústico, tomate ralado e azeite virgem extra", precio: "2,80 €", extra: ["gluten"] },
                    { nombre: "Croissant na chapa", descripcion: "Com manteiga e compota", precio: "2,50 €", extra: ["gluten", "huevos", "lacteos"] } ] },
                { nombre: "Bebidas", itens: [
                    { nombre: "Galão", descripcion: "", precio: "1,60 €", extra: ["lacteos"] },
                    { nombre: "Sumo de laranja natural", descripcion: "", precio: "3,20 €", extra: [] } ] } ] },
        en: { negocio: { nombre: "Café Aurora", direccion: "12 High Street", telefono: "910 000 000" },
              categorias: [
                { nombre: "Breakfast", itens: [
                    { nombre: "Tomato toast", descripcion: "Country bread, grated tomato and extra virgin olive oil", precio: "€2.80", extra: ["gluten"] },
                    { nombre: "Grilled croissant", descripcion: "With butter and jam", precio: "€2.50", extra: ["gluten", "huevos", "lacteos"] } ] },
                { nombre: "Drinks", itens: [
                    { nombre: "Latte", descripcion: "", precio: "€1.60", extra: ["lacteos"] },
                    { nombre: "Fresh orange juice", descripcion: "", precio: "€3.20", extra: [] } ] } ] }
    }
    return JSON.parse(JSON.stringify(ex[idioma] || ex.es))
}
