from flask import Flask, render_template, Response
import webbrowser

app=Flask(__name__)

@app.route('/')
def main():
    with open("AutoUI.html", "r") as f:
        content = f.read()
    return Response(content, mimetype='text/html')  

webbrowser.open("http://localhost:7443")
app.run(host="0.0.0.0", port=7443)