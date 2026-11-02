"""VERIFICADOR DE TRADUCOES

Monta cada pagina com o Flask (como o navegador recebe) e confere:
  1. cada etiqueta data-i18n (texto, html, placeholder, aria-label) tem traducao em PT e EN;
  2. a pagina carrega o arquivo de traducao do grupo usado (ex.: traducoes/nosotros.js);
  3. os textos que so existem no JavaScript tem os 3 idiomas (ES, PT e EN).
     Regra: toda chave que tem versao "es" no arquivo de traducao e um texto do JavaScript
     (o espanhol dos textos do HTML fica no proprio HTML, entao so o JS precisa do "es");
  4. nao ha traducoes sobrando (chaves que nenhum template usa).

Como rodar (na pasta do projeto, com o venv):
    venv\\Scripts\\python tests\\verificar_traducoes.py

Precisa do Node.js instalado (os arquivos de traducao sao JavaScript).
Sai com codigo 0 se estiver tudo certo e 1 se encontrar problemas.
"""
import glob
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # pasta do projeto
PASTA_TEMPLATES = os.path.join(RAIZ, "templates")
PASTA_TRADUCOES = os.path.join(RAIZ, "static", "js", "traducoes")

def carregar_traducoes():
    """executa os arquivos de traducao no Node e devolve o objeto TRADUCOES"""
    # comum.js primeiro (e ele que cria o objeto TRADUCOES), como no base.html
    arquivos = sorted(glob.glob(os.path.join(PASTA_TRADUCOES, "*.js")), key=lambda f: (os.path.basename(f) != "comum.js", f))
    codigo = "var window = {};\n"
    codigo += "\n".join(open(f, encoding="utf-8").read() for f in arquivos)
    codigo += "\nprocess.stdout.write(JSON.stringify(TRADUCOES))"
    # o codigo vai pela entrada padrao (stdin): na linha de comando o Windows tem limite de tamanho
    resultado = subprocess.run(["node", "-"], input=codigo, capture_output=True, text=True, encoding="utf-8")
    if resultado.returncode != 0:
        sys.exit("Erro ao ler os arquivos de traducao:\n" + resultado.stderr)
    return json.loads(resultado.stdout)


def montar_paginas():
    """monta cada template de pagina com o Flask e devolve {nome: html}.
    Assim laços {% for %}, heranca e {{ MARCA }} ja aparecem resolvidos."""
    sys.path.insert(0, RAIZ)
    from flask import render_template
    import meu_site
    paginas = {}
    for caminho in sorted(glob.glob(os.path.join(PASTA_TEMPLATES, "**", "*.html"), recursive=True)):
        nome = os.path.relpath(caminho, PASTA_TEMPLATES).replace(os.sep, "/")
        if nome == "base.html" or os.path.basename(nome).startswith("_"):
            continue  # a moldura e os pedacos so existem dentro das paginas
        with meu_site.app.test_request_context("/"):
            paginas[nome] = render_template(nome)
    return paginas


def main():
    traducoes = carregar_traducoes()
    problemas, usadas = [], set()

    for nome, texto in montar_paginas().items():
        chaves = sorted(set(re.findall(r'data-i18n(?:-html|-placeholder|-aria-label)?="([^"]+)"', texto)))
        carregados = set(re.findall(r"/static/js/traducoes/(\w+)\.js", texto))
        print(f"{nome:24} {len(chaves):3} chaves | traducoes: {', '.join(sorted(carregados)) or '-'}")

        for chave in chaves:
            usadas.add(chave)
            grupo, _, k = chave.partition(".")
            if grupo not in traducoes:
                problemas.append(f"{nome}: o grupo '{grupo}' nao existe (chave {chave})")
                continue
            if grupo not in carregados:
                problemas.append(f"{nome}: usa '{chave}' mas nao carrega traducoes/{grupo}.js")
            for idioma in ("pt", "en"):
                if k not in traducoes[grupo].get(idioma, {}):
                    problemas.append(f"{nome}: falta '{chave}' em {idioma.upper()}")

    # textos do JavaScript: reconhecidos automaticamente por terem versao "es"
    so_js = sorted(f"{g}.{k}" for g, idiomas in traducoes.items() for k in idiomas.get("es", {}))
    for chave in so_js:
        usadas.add(chave)
        grupo, _, k = chave.partition(".")
        for idioma in ("pt", "en"):
            if k not in traducoes[grupo].get(idioma, {}):
                problemas.append(f"texto do JavaScript '{chave}' falta em {idioma.upper()}")
    print(f"\ntextos do JavaScript (com ES, PT e EN): {len(so_js)}")

    sobrando = sorted({f"{g}.{k}" for g, idiomas in traducoes.items()
                       for idioma in ("pt", "en") for k in idiomas.get(idioma, {})} - usadas)
    for chave in sobrando:
        problemas.append(f"traducao sem uso em nenhum template: {chave}")

    if problemas:
        print(f"\n{len(problemas)} PROBLEMA(S):")
        for p in problemas:
            print("  -", p)
        sys.exit(1)
    print("\nOK: nenhum problema encontrado")


if __name__ == "__main__":
    main()
