# meu primeiro site
# criado por Daniel Mota

import mimetypes
import os
from datetime import date

from flask import Flask, Response, render_template, redirect, request, url_for
from markupsafe import Markup, escape
from werkzeug.middleware.proxy_fix import ProxyFix

# ===== MARCA: para trocar o nome do site, mude só estas linhas =====
MARCA = "dev_mot4"
AUTOR = "Daniel Mota"
INSTAGRAM = "https://instagram.com/dev_mot4"

# ===== ENDERECO DO SITE (usado no Open Graph, robots.txt e sitemap.xml) =====
# Vazio = usa o endereco de onde o site esta sendo servido (local ou Render).
# Quando tiver o dominio: SITE_URL = "https://www.seudominio.com"  (sem barra no final)
SITE_URL = ""

# tipo correto das fontes (o Windows nao conhece .woff2 por padrao)
mimetypes.add_type("font/woff2", ".woff2")

app = Flask(__name__)

# O Render recebe a visita em https e repassa ao Flask por dentro em http, avisando o original
# no cabecalho X-Forwarded-Proto. O ProxyFix faz o Flask acreditar nesse aviso (1 proxy na frente),
# para os enderecos completos sairem com https:// e o IP do visitante ser o real.
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)


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
        "URL_SITE": url_do_site(),
    }


def url_do_site():
    """endereco base do site, sem barra no final: o SITE_URL ou, se vazio, o de onde o site esta sendo servido"""
    return (SITE_URL or request.url_root).rstrip("/")


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


# ===== PARA OS ROBOS DE BUSCA (Google, Bing...) =====

# paginas que entram no mapa do site (nome da funcao da rota). Legais, /obrigado e erros ficam de fora.
# Ao criar uma pagina nova que deve aparecer no Google, acrescente o nome dela aqui.
PAGINAS_SITEMAP = ["inicio", "servicios", "herramientas", "nosotros", "contacto"]

@app.route("/robots.txt")
def robots_txt():
    # nao bloqueamos /obrigado aqui: ele ja tem "noindex", e o robo precisa entrar para ler esse aviso
    texto = f"User-agent: *\nAllow: /\n\nSitemap: {url_do_site()}/sitemap.xml\n"
    return Response(texto, mimetype="text/plain")

@app.route("/sitemap.xml")
def sitemap_xml():
    # sem <lastmod>: no Render a data dos arquivos vira a data do deploy, e o Google passaria a ignora-la
    enderecos = [url_do_site() + url_for(pagina) for pagina in PAGINAS_SITEMAP]
    xml = render_template("sitemap.xml", enderecos=enderecos)
    return Response(xml, mimetype="application/xml")


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
