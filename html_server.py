from flask import Flask, render_template, Response, send_from_directory
import webbrowser

app=Flask(__name__)

@app.route('/')
def main():
    with open("AutoUI.html", "r") as f:
        content = f.read()
    return Response(content, mimetype='text/html')

@app.route("/visualizer")
def visualizer():
    return send_from_directory("splat", "index.html")

@app.route("/<path:filename>")
def serve_static_files(filename):
    if filename.endswith(".js"):
        return send_from_directory("splat", filename, mimetype="application/javascript")
    return send_from_directory("splat", filename)

webbrowser.open("http://localhost:7443")
app.run(host="0.0.0.0", port=7443)