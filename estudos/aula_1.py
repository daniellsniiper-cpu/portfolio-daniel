# Modulo 2 - aula 1

# Tratamento de erros

# Criado por Daniel

print("=== calculadora segura ===")

try:
    numero1 = float(input("digite o primeiro numero "))
    numero2 = float(input("digite o segundo numero: "))
    resultado = numero1 / numero2
    print("resultado:", resultado)
except  ValueError:
    print("erro! Digite apenas numeros!")
except ZeroDivisionError:
    print("erro! nao e possivel dividir por zero!")
except:
    print("Aconteceu um erro inesperdo!")

print("Programa finalizado com sucesso!")
