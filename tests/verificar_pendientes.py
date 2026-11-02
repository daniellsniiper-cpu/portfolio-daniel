"""VERIFICADOR DE PENDENCIAS — rodar ANTES de cada deploy

Monta todas as paginas com o Flask (como o visitante as veria) e procura
marcadores [PENDIENTE: ...], como o NIF ou o email que ainda nao existem.
O site NAO deve ir ao ar enquanto houver algum.

Como rodar (na pasta do projeto, com o venv):
    venv\\Scripts\\python tests\\verificar_pendientes.py

Para preencher um dado: procure no template a chamada pendiente("...")
e troque pelo texto real (ex.: pendiente("NIF") -> 12345678Z).
Sai com codigo 0 se nao houver pendencias e 1 se houver.
"""
import glob
import html
import os
import re
import sys
from collections import defaultdict

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA_TEMPLATES = os.path.join(RAIZ, "templates")


def main():
    sys.path.insert(0, RAIZ)
    from flask import render_template
    import meu_site

    pendencias = defaultdict(list)  # texto -> paginas onde aparece
    for caminho in sorted(glob.glob(os.path.join(PASTA_TEMPLATES, "**", "*.html"), recursive=True)):
        nome = os.path.relpath(caminho, PASTA_TEMPLATES).replace(os.sep, "/")
        if nome == "base.html" or os.path.basename(nome).startswith("_"):
            continue
        with meu_site.app.test_request_context("/"):
            pagina = render_template(nome)
        for texto in re.findall(r"\[PENDIENTE:\s*([^\]]+)\]", pagina):
            texto = html.unescape(texto.strip())
            if nome not in pendencias[texto]:
                pendencias[texto].append(nome)

    # o endereco do site (Open Graph, robots.txt, sitemap.xml) precisa do dominio antes do deploy
    if not meu_site.SITE_URL:
        pendencias["SITE_URL vazia: preencha com o dominio (ex.: https://www.seudominio.com)"].append("meu_site.py")

    if not pendencias:
        print("OK: nenhuma pendencia. O site pode ir ao ar.")
        return
    print(f"{len(pendencias)} PENDENCIA(S) — o site NAO pode ir ao ar assim:\n")
    for texto, paginas in sorted(pendencias.items()):
        print(f"  [PENDIENTE: {texto}]")
        print(f"      em: {', '.join(paginas)}")
    sys.exit(1)


if __name__ == "__main__":
    main()
