// MODOS DA FERRAMENTA: mesma estrutura de dados (categorias -> itens com nome, descricao e preco),
// cada modo com um campo extra e os seus estilos.
var CARTA = window.CARTA || {}

// extra: "alergenos" (lista de icones) ou um texto curto; rotulo/exemplo = chaves de traducoes/carta.js;
// posicao do texto extra no documento: "coluna" (antes do preco); item = palavra dos botoes ("+ Añadir plato")
CARTA.MODOS = {
    carta:     { disponivel: true,  extra: "alergenos", estilos: ["elegante", "moderno"], item: "Plato" },
    servicios: { disponivel: true,  extra: "duracion",  estilos: ["minimalista", "lujo"], rotulo: "lblDuracion", exemploCampo: "phDuracion", posicao: "coluna", item: "Servicio" },
    precios:   { disponivel: false, extra: "referencia", estilos: [], item: "Producto" }   // Parte 3
}

// textos fixos do PDF, no idioma escolhido para a carta (nao no idioma da interface)
CARTA.TEXTOS_PDF = {
    es: { alergenos: "Alérgenos", hechoCon: "Hecho con", ivaIncluido: "Precios con IVA incluido" },
    pt: { alergenos: "Alergénios", hechoCon: "Feito com", ivaIncluido: "Preços com IVA incluído" },
    en: { alergenos: "Allergens", hechoCon: "Made with", ivaIncluido: "Prices include VAT" }
}

// conteudo de exemplo (primeira visita), no idioma da interface — para a previa nao comecar vazia
CARTA.exemplo = function (modo, idioma) {
    var exemplos = {}
    exemplos.carta = {
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
    exemplos.servicios = {
        es: { negocio: { nombre: "Estudio Bella", direccion: "Calle Serrano 20, Madrid", telefono: "910 000 000" },
              categorias: [
                { nombre: "Peluquería", itens: [
                    { nombre: "Corte y peinado", descripcion: "Lavado, corte y secado", precio: "35,00 €", extra: "60 min" },
                    { nombre: "Color completo", descripcion: "Tinte de raíz a puntas y peinado", precio: "55,00 €", extra: "90 min" } ] },
                { nombre: "Manicura y pedicura", itens: [
                    { nombre: "Manicura semipermanente", descripcion: "Esmaltado de larga duración", precio: "20,00 €", extra: "45 min" },
                    { nombre: "Pedicura spa", descripcion: "", precio: "30,00 €", extra: "60 min" } ] } ] },
        pt: { negocio: { nombre: "Estúdio Bella", direccion: "Avenida da Liberdade 20, Lisboa", telefono: "210 000 000" },
              categorias: [
                { nombre: "Cabeleireiro", itens: [
                    { nombre: "Corte e penteado", descripcion: "Lavagem, corte e secagem", precio: "35,00 €", extra: "60 min" },
                    { nombre: "Coloração completa", descripcion: "Coloração da raiz às pontas e penteado", precio: "55,00 €", extra: "90 min" } ] },
                { nombre: "Manicure e pedicure", itens: [
                    { nombre: "Manicure gel", descripcion: "Verniz de longa duração", precio: "20,00 €", extra: "45 min" },
                    { nombre: "Pedicure spa", descripcion: "", precio: "30,00 €", extra: "60 min" } ] } ] },
        en: { negocio: { nombre: "Bella Studio", direccion: "20 High Street", telefono: "910 000 000" },
              categorias: [
                { nombre: "Hair", itens: [
                    { nombre: "Cut and style", descripcion: "Wash, cut and blow-dry", precio: "€35.00", extra: "60 min" },
                    { nombre: "Full colour", descripcion: "Root-to-tip colour and styling", precio: "€55.00", extra: "90 min" } ] },
                { nombre: "Nails", itens: [
                    { nombre: "Gel manicure", descripcion: "Long-lasting polish", precio: "€20.00", extra: "45 min" },
                    { nombre: "Spa pedicure", descripcion: "", precio: "€30.00", extra: "60 min" } ] } ] }
    }
    var conjunto = exemplos[modo] || exemplos.carta
    return JSON.parse(JSON.stringify(conjunto[idioma] || conjunto.es))
}
