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
        index = random.randint(0, 249)
        if index not in indices:
            indices.append(index)
    for i in indices:
        data = df.iloc[i]
        res[data["Name"]] = data["Value"]
    return jsonify(res)

@app.route('/api/fiveaside', methods=["GET", "POST"])
def fiveaside():
    df = pd.read_csv("src/assets/eafc25top100.csv")
    res = {}
    atts = []
    defs = []
    gks = []
    total1 = 0
    total2 = 0
    valid_att = ["ST", "LW", "RW", "CAM", "CM", "CF", "LM", "RM"]
    valid_def = ["LB", "RB", "CB", "CDM", "LWB", "RWB", "CM", "LM", "RM"]
    while len(atts) < 4 or len(defs) < 4 or len(gks) < 2:
        index = random.randint(0, 99)
        if index not in defs and index not in atts and df.iloc[index]["Position"] in valid_def and len(atts) < 4:
            defs.append(index)
        elif index not in atts and index not in defs and df.iloc[index]["Position"] in valid_att and len(atts) < 4:
            atts.append(index)
        elif index not in gks and df.iloc[index]["Position"] == "GK" and len(gks) < 2:
            gks.append(index)
    num = 1
    for i in atts[:2]:
        data = df.iloc[i]
        res["ATT1_" + str(num)] = data["Name"]
        total1 += int(data["Rating"])
        num += 1
    num = 1
    for i in defs[:2]:
        data = df.iloc[i]
        res["DEF1_" + str(num)] = data["Name"]
        total1 += int(data["Rating"])
        num += 1
    data = df.iloc[gks[0]]
    res["GK1"] = data["Name"]
    total1 += int(data["Rating"])

    num = 1
    for i in atts[-2:]:
        data = df.iloc[i]
        res["ATT2_" + str(num)] = data["Name"]
        total2 += int(data["Rating"])
        num += 1
    num = 1
    for i in defs[-2:]:
        data = df.iloc[i]
        res["DEF2_" + str(num)] = data["Name"]
        total2 += int(data["Rating"])
        num += 1
    data = df.iloc[gks[1]]
    res["GK2"] = data["Name"]
    total2 += int(data["Rating"])

    diff = abs(total1 - total2)

    if diff <= 2:
        res["Result"] = "Draw"
    elif total1 < total2:
        res["Result"] = "Win"
    else:
        res["Result"] = "Loss"

    winner = random.randint(1, 5)

    if diff <= 2:
        loser = winner
    elif diff <= 5:
        loser = winner - 1 if winner - 1 >= 0 else 0
    elif diff <= 10:
        loser = winner - 2 if winner - 2 >= 0 else 0
    elif diff <= 15:
        loser = winner - 3 if winner - 3 >= 0 else 0
    else:
        winner = random.randint(4, 6)
        loser = 0

    res["Score"] = f"{winner} - {loser}"

    return jsonify(res)

@app.route('/api/blindrank', methods=["GET", "POST"])
def blindrank():
    df = pd.read_csv("src/assets/eafc25top100.csv")
    indices = []
    res = {}
    while len(indices) < 5:
        index = random.randint(0, 99)
        if index not in indices:
            indices.append(index)
    indices.sort()
    j = 1
    for i in indices:
        data = df.iloc[i]
        res[data["Name"]] = j
        j += 1
    return res

@app.route('/api/whoscored', methods=["GET", "POST"])
def whoscored():
    res = {}
    res["Kevin de Bruyne"] = "https://www.youtube.com/embed/Ml5PNPdDInI?si=uENiBNO2kOC4eYeR&amp;controls=0"
    return jsonify(res)

@app.route('/api/playernames', methods=["GET", "POST"])
def playernames():
    df = pd.read_csv("src/assets/eafc25top100.csv")
    players = df["Name"]
    return list(players)

if __name__ == "__main__":
    app.run(port=3000)