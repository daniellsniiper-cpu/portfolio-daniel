# Funcoes com dicionarios
# Criado por Daniel

def cadastrar_cliente(nome, telefone, servico, valor):
    cliente = {
        "nome": nome,
        "telefone": telefone,
        "servico": servico,
        "valor": valor
    }
    return cliente

clientes = []

clientes.append(cadastrar_cliente("maria silva", "1199999998", "fio a fio", 80))
clientes.append(cadastrar_cliente("ana santos", "123456789", "volume", 120))
clientes.append(cadastrar_cliente("lara mota", "664389672", "fio a fio", 90))

for cliente in clientes:
    print("---")
    print("nome:", cliente["nome"])
    print("servico:", cliente["servico"])
    print("valor: R$", cliente["valor"])

print("---")
print("total de clientes:", len(clientes))