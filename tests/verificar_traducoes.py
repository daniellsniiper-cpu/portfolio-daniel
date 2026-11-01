"""VERIFICADOR DE TRADUCOES

Confere, em todos os templates:
  1. cada etiqueta data-i18n (texto, html, placeholder, aria-label) tem traducao em PT e EN;
  2. a pagina carrega o arquivo de traducao do grupo usado (ex.: traducoes/nosotros.js);
  3. os textos que so existem no JavaScript tem os 3 idiomas (ES, PT e EN);
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

# textos que so aparecem pelo JavaScript (nao estao no HTML): precisam de ES, PT e EN
SO_JAVASCRIPT = {"inicio.frases", "contacto.enviando", "contacto.erro"}


def carregar_traducoes():
    """executa os arquivos de traducao no Node e devolve o objeto TRADUCOES"""
    arquivos = sorted(glob.glob(os.path.join(PASTA_TRADUCOES, "*.js")))
    codigo = "var window = {};\n"
    codigo += "\n".join(open(f, encoding="utf-8").read() for f in arquivos)
    codigo += "\nprocess.stdout.write(JSON.stringify(TRADUCOES))"
    resultado = subprocess.run(["node", "-e", codigo], capture_output=True, text=True, encoding="utf-8")
    if resultado.returncode != 0:
        sys.exit("Erro ao ler os arquivos de traducao:\n" + resultado.stderr)
    return json.loads(resultado.stdout)


def grupos_carregados(nome, visitados=()):
    """grupos de traducao que um template carrega (somando o base.html que ele estende)"""
    texto = open(os.path.join(PASTA_TEMPLATES, nome), encoding="utf-8").read()
    grupos = set(re.findall(r"/static/js/traducoes/(\w+)\.js", texto))
    pai = re.search(r'{%\s*extends\s+"([^"]+)"', texto)
    if pai and pai.group(1) not in visitados:
        grupos |= grupos_carregados(pai.group(1), visitados + (nome,))
    return grupos


def main():
    traducoes = carregar_traducoes()
    problemas, usadas = [], set()

    templates = sorted(glob.glob(os.path.join(PASTA_TEMPLATES, "**", "*.html"), recursive=True))
    for caminho in templates:
        nome = os.path.relpath(caminho, PASTA_TEMPLATES).replace(os.sep, "/")
        texto = open(caminho, encoding="utf-8").read()
        chaves = sorted(set(re.findall(r'data-i18n(?:-html|-placeholder|-aria-label)?="([^"]+)"', texto)))
        carregados = grupos_carregados(nome)
        print(f"{nome:24} {len(chaves):3} chaves | traducoes: {', '.join(sorted(carregados)) or '-'}")

        for chave in chaves:
            usadas.add(chave)
            grupo, _, k = chave.partition(".")
            if grupo not in traducoes:
                problemas.append(f"{nome}: o grupo '{grupo}' nao existe (chave {chave})")
                continue
            if grupo not in carregados and nome != "base.html":
                problemas.append(f"{nome}: usa '{chave}' mas nao carrega traducoes/{grupo}.js")
            for idioma in ("pt", "en"):
                if k not in traducoes[grupo].get(idioma, {}):
                    problemas.append(f"{nome}: falta '{chave}' em {idioma.upper()}")

    for chave in sorted(SO_JAVASCRIPT):
        usadas.add(chave)
        grupo, _, k = chave.partition(".")
        for idioma in ("es", "pt", "en"):
            if k not in traducoes.get(grupo, {}).get(idioma, {}):
                problemas.append(f"texto so do JavaScript '{chave}' falta em {idioma.upper()}")

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
