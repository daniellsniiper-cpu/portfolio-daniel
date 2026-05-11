# Sistema de estoque 
#Criado por Daniel Mota 

import json

class Produto:
    def __init__(self, nome, preco, quantidade):
        self.nome = nome
        self.preco = preco
        self.quantidade = quantidade

    def mostrar(self):
        print("---")
        print("produto:", self.nome)
        print("preco: R$", self.preco)
        print("quantidade:", self.quantidade)
        if self.quantidade <= 4:
            print("⚠️ ESTOQUE BAIXO !!")
try:
    with open("estoque.json", "r") as arquivo:
        dados = json.load(arquivo)
        estoque = [Produto(p["nome"], p["preco"], p["quantidade"]) for p in dados]
except:        
       estoque = []

print ("=== SISTEMA DE ESTOQUE ===")


opcao = ""
while opcao != "5":
    print("---")
    print("1 - adicionar produto")
    print("2 - ver estoque")
    print("3 - remover produto")
    print("4 - atualizar quantidade")
    print("5 - sair")
    opcao = input("escolha uma opcao")

    if opcao == "1":
        nome = input("nome do produto: ")
        try:
            preco = float(input("preco R$ "))
            quantidade = int(input("quantidade"))
        except ValueError:
            print("erro! Digite apenas numeros!")
            preco = 0
            quantidade = 0
        produto = Produto(nome, preco, quantidade)
        estoque.append(produto)
        with open("estoque.json", "w") as arquivo:
            json.dump([{"nome": p.nome, "preco": p.preco, "quantidade": p.quantidade,} for p in estoque], arquivo)
        print("✓ produto adicionado com sucesso!")
    elif opcao == "2":
        if len(estoque) == 0:
            print("estoque vazio")
        else:
            for produto in estoque:
                produto.mostrar()
    elif opcao == "3":
        nome = input("qual produto quer remover?")
        encontrou = False
        for produto in estoque:
            if produto.nome == nome:
                estoque.remove(produto)
                with open("estoque.json", "w") as arquivo:
                    json.dump([{"nome": p.nome, "preco": p.preco, "quantidade": p.quantidade,} for p in estoque], arquivo)
                print("✓ produto removido com sucesso!")            
                encontrou = True
                break
        if not encontrou:
            print("⚠️ produto nao encontrado!")
    elif opcao == "4":
        nome = input("qual produto foi usado? ")
        encontrou = False
        for produto in estoque:
            if produto.nome == nome:
                try:
                    usado = int(input("quantas unidades foram usadas? "))
                    produto.quantidade -= usado
                    print("✓ estoque atualizado!")
                    with open("estoque.json", "w") as arquivo:
                        json.dump([{"nome": p.nome, "preco": p.preco, "quantidade": p.quantidade,} for p in estoque], arquivo)
                    print("agora tem", produto.quantidade, nome, "no estoque")
                    if produto.quantidade <= 2:
                        print("⚠️ ESTOQUE BAIXO! !")
                except ValueError:
                    print("erro! Digite apenas numeros!")
                encontrou = True
                break
        if not encontrou:
            print("produto nao encontrado!")



print("=== ATE LOGO! ! ===")