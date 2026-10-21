# meu primeiro site
# criado por Daniel Mota

import os
from datetime import date

from flask import Flask, render_template, redirect
from markupsafe import Markup, escape

# ===== MARCA: para trocar o nome do site, mude só estas linhas =====
MARCA = "dev_mot4"
AUTOR = "Daniel Mota"
INSTAGRAM = "https://instagram.com/dev_mot4"

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


@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/sobre")
def sobre():
    return redirect("/#sobre", code=301)

@app.route("/projetos")
def projetos():
    return redirect("/#projetos", code=301)

@app.route("/contato")
def contato():
    return redirect("/#contato", code=301)

@app.route("/obrigado")
def obrigado():
    return render_template("obrigado.html")

if __name__ == "__main__":
    # debug so liga com FLASK_DEBUG=1 (nunca em producao)
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")
