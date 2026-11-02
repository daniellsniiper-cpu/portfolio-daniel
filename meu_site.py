# meu primeiro site
# criado por Daniel Mota

import mimetypes
import os
from datetime import date

from flask import Flask, render_template, redirect
from markupsafe import Markup, escape

# ===== MARCA: para trocar o nome do site, mude só estas linhas =====
MARCA = "dev_mot4"
AUTOR = "Daniel Mota"
INSTAGRAM = "https://instagram.com/dev_mot4"

# tipo correto das fontes (o Windows nao conhece .woff2 por padrao)
mimetypes.add_type("font/woff2", ".woff2")

app = Flask(__name__)


def marca_colorida(nome):
    # letras ficam brancas; simbolos e numeros (ex: "_" e "4") ficam azuis
    partes = []
    for letra in nome:
        if letra.isalpha():
            partes.append(escape(letra))
        else:
            partes.append(Markup('<span class="marca-destaque">%s</span>') % letra)
    return Markup("").join(partes)


@app.context_processor
def dados_da_marca():
    # disponivel em todos os templates: {{ MARCA }}, {{ MARCA_HTML }}, {{ AUTOR }} ...
    return {
        "MARCA": MARCA,
        "MARCA_HTML": marca_colorida(MARCA),
        "AUTOR": AUTOR,
        "INSTAGRAM": INSTAGRAM,
        "INSTAGRAM_USUARIO": "@" + INSTAGRAM.rstrip("/").split("/")[-1],
        "ano": date.today().year,
    }


# ===== PAGINAS =====
# o nome da funcao (ex.: "servicios") e o que o menu usa para saber a pagina atual

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/servicios")
def servicios():
    return render_template("servicios.html")

@app.route("/herramientas")
def herramientas():
    return render_template("herramientas.html")

@app.route("/nosotros")
def nosotros():
    return render_template("nosotros.html")

@app.route("/contacto")
def contacto():
    return render_template("contacto.html")

@app.route("/obrigado")
def obrigado():
    return render_template("obrigado.html")

# paginas legais (LSSI e RGPD)
@app.route("/aviso-legal")
def aviso_legal():
    return render_template("legal/aviso_legal.html")

@app.route("/privacidad")
def privacidad():
    return render_template("legal/privacidad.html")

@app.route("/cookies")
def cookies():
    return render_template("legal/cookies.html")


# ===== PAGINAS DE ERRO =====
# o ", 404" / ", 500" no final mantem o codigo de erro: o Google entende que a pagina nao existe

@app.errorhandler(404)
def pagina_nao_encontrada(erro):
    return render_template("erros/404.html"), 404

@app.errorhandler(500)
def erro_no_servidor(erro):
    return render_template("erros/500.html"), 500


# ===== ENDERECOS ANTIGOS: redirecionam (301 = mudou para sempre) =====

@app.route("/sobre")
def sobre():
    return redirect("/nosotros", code=301)

@app.route("/projetos")
def projetos():
    return redirect("/servicios", code=301)

@app.route("/contato")
def contato():
    return redirect("/contacto", code=301)

if __name__ == "__main__":
    # debug so liga com FLASK_DEBUG=1 (nunca em producao)
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
