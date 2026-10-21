# meu primeiro site
# criado por Daniel Mota

from flask import Flask, render_template, redirect

app = Flask(__name__)

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/sobre")
def sobre():
    return redirect("/#sobre", code=301)

@app.route("/projetos")
def projetos():
    return redirect("/#projetos", code=301)

@app.route("/contato")
def contato():
    return redirect("/#contato", code=301)

if __name__ =="__main__":
    app.run(debug=True)
