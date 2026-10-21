# Sistema do Studio da Lara
# Criado por Daniel Mota

import json

def cadastrar_cliente(nome, telefone, servico, valor, data, horario):
    cliente = {
        "nome": nome,
        "telefone": telefone,
        "servico": servico,
        "valor": valor,
        "data": data,
        "horario": horario,
    }
    return cliente

def ver_clientes(clientes):
    if len(clientes) == 0:
        print("nenhuma cliente cadastrada ainda!")
    else:
        for cliente in clientes:
            print("---")
            print("nome:", cliente["nome"])
            print("telefone:", cliente["telefone"])
            print("servico:", cliente["servico"])
            print("valor:", cliente["valor"])
            print("data:", cliente["data"])
            print("horario:", cliente["horario"])

try:
    with open("clientes_lara.json", "r") as arquivo:
        clientes = json.load(arquivo)
except:
    clientes = []

print("=== BEM VINDA AO STUDIO LARA MARQUES ===")

opcao = ""
while opcao != "5":
    print("---")
    print("1 - cadastrar nova cliente")
    print("2 - ver todas as clientes")
    print("3 - buscar cliente")
    print("4 - total faturado")
    print("5 - sair")
    opcao = input("escolher uma opcao: ")

    if opcao == "1":
        nome = input("nome da cliente: ")
        telefone = input("telefone: ")
        servico = input("servico(fio a fio, volume): ")
        try:
            valor = float(input("valor: R$ "))
        except ValueError:
            print("erro! dDigite apenas numero no valor!")
            valor = 0
        data = input("data do agendamento: ")
        horario = input("horario: ")
        cliente = cadastrar_cliente(nome, telefone, servico, valor, data, horario)
        clientes.append(cliente)
        with open("clientes_lara.json", "w") as arquivo:
            json.dump(clientes, arquivo)
        print("✓ cliente cadastrada com sucesso!")

    elif opcao == "2":
        ver_clientes(clientes)

    elif opcao == "3":
        nome = input("digite o nome da cliente: ")
        encontrou = False
        for cliente in clientes:
            if cliente["nome"] == nome:
                print("---")
                print("nome:", cliente["nome"])
                print("telefone:", cliente["telefone"])
                print("servico:", cliente["servico"])
                print("valor: R$", cliente["valor"])
                print("data:", cliente["data"])
                print("horario:", cliente["horario"])
                encontrou = True
        if not encontrou:
            print("cliente nao encontrada!")
    elif opcao =="4":
        total = 0
        for cliente in clientes:
            total += cliente["valor"]
        print("---")
        print("total de clientes:", len(clientes)) 
        print("total faturado: R$",total)
        print("---")     

print("=== ATE LOGO!! ===")
