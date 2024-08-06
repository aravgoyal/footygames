from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import random

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/transferxi', methods=["GET", "POST"])
def transferxi():
    df = pd.read_csv("src/assets/transfer-values.csv")
    res = {}
    indices = []
    while len(indices) < 11:
        index = random.randint(0, 250)
        if index not in indices:
            indices.append(index)
    for i in indices:
        data = df.iloc[i]
        res[data["Name"]] = data["Value"]
    return jsonify(res)

if __name__ == "__main__":
    app.run(port=3000)