# meu primeiro site 
# criado por Daniel Mota

from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/sobre")
def sobre():
    return render_template("sobre.html")

@app.route("/projetos")
def projetos():
    return render_template("projetos.html")

@app.route("/contato")
def contato():
    return render_template("contato.html")

if __name__ =="__main__":
    app.run(debug=True)
