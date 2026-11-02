"""VERIFICADOR DE ARQUIVOS ESTATICOS

Nos templates, os arquivos de static/ devem ser chamados com {{ estatico('css/style.css') }},
que acrescenta a versao automatica (?v=...). Um "/static/..." escrito a mao funciona, mas
fica sem versao: o navegador revalida a cada visita (mais lento) em vez de guardar por 1 ano.

Como rodar (na pasta do projeto, com o venv):
    venv\\Scripts\\python tests\\verificar_estaticos.py

Sai com codigo 0 se estiver tudo certo e 1 se encontrar "/static/" escrito a mao.
"""
import glob
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA_TEMPLATES = os.path.join(RAIZ, "templates")


def main():
    problemas = []
    for caminho in sorted(glob.glob(os.path.join(PASTA_TEMPLATES, "**", "*.*"), recursive=True)):
        nome = os.path.relpath(caminho, PASTA_TEMPLATES).replace(os.sep, "/")
        for numero, linha in enumerate(open(caminho, encoding="utf-8"), start=1):
            sem_comentarios = re.sub(r"{#.*?#}", "", linha)
            if "/static/" in sem_comentarios:
                problemas.append(f"{nome}:{numero}: {linha.strip()[:90]}")
    if problemas:
        print(f"{len(problemas)} ARQUIVO(S) ESTATICO(S) SEM estatico():")
        for p in problemas:
            print("  -", p)
        print("\nTroque por {{ estatico('...') }}, ex.: {{ estatico('css/style.css') }}")
        sys.exit(1)
    print("OK: todos os arquivos estaticos dos templates usam estatico() (com versao)")


if __name__ == "__main__":
    main()
