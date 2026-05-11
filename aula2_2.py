# Modulos 2 - aula 2 
# Classes e objetos
# criado por Daniel Mota 


class Cliente:
    def __init__(self, nome, telefone, sevicio, valor) :
        self.nome = nome
        self.telefone = telefone
        self.sevico = sevicio
        self.valor = valor

    def apresentar(self):
        print("---")
        print("nome:", self.nome)
        print("telefone:", self.telefone)
        print("sevico:", self.sevico)
        print("valor: R$", self.valor)
        

# criando Clientes 
cliente1=Cliente("maria silva", "11999998888", "fio a fio", 80)
cliente2 = Cliente("lara mota", "664389672", "volume", 120)


# Mostrando Clientes 
cliente1.apresentar()
cliente2.apresentar()
