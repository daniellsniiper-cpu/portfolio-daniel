nome = input("qual e o seu nome? ")
idade = int(input("qual e a sua idade? ")
sonhos = ["ter uma casa", "ter minha empresa", "liberdade financeira"]

print("---")
print("ola", nome, "seus sonhos sao:")
for sonho in sonhos:
    print("-", sonho)
if idade >= 18:
   print("voce tem", idade, "anos e vai conquistar tudo isso!")
else:
   print("voce ainda e jovem, o futuro e seu!")
print("---")
