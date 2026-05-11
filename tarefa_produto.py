# modulo 3 tarefa para casa
# classe e produtos
# criado por daniel 


class Produto:
    def __init__(self, nome, preco, quantidade,):
        self.nome = nome
        self.preco = preco
        self.quantidade = quantidade

    def apresentar(self):
        print("---")
        print("nome:", self.nome)
        print("preco:", self.preco)
        print("quantidade:", self.quantidade)


# Criando produtos 
produto1 = Produto("compressor", 9000, 1,)
produto2 = Produto("transmicao", 100, 1,)

#Mostrando produtos
produto1.apresentar()
produto2.apresentar()