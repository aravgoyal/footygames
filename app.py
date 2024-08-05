from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/transfermarkt', methods=["GET", "POST"])
def take_it():
    data = request.json()
    return "elp elp elp"

if __name__ == "__main__":
    app.run(port=3000)