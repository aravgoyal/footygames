from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bs4 import BeautifulSoup
import requests
from datetime import datetime

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

uri = "mongodb+srv://aravgoyal:9bEm16wiXThGu7Ac@footygames.jwayt.mongodb.net/?retryWrites=true&w=majority&appName=FootyGames"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["footygames"]
eafc = db["eafctop100"]
videos = db["videos"]
transfer = db["transfervalues"]

@app.route('/api/transferxi', methods=["GET", "POST"])
def transferxi():
    st = list(transfer.find({"Position": "ST"}))
    w = list(transfer.find({"Position": "W"}))
    cm = list(transfer.find({"Position": "CM"}))
    fb = list(transfer.find({"Position": "FB"}))
    cb = list(transfer.find({"Position": "CB"}))
    gk = list(transfer.find({"Position": "GK"}))
    res = {}
    indices = []
    while len(indices) < 3:
        index = random.randint(0, len(gk) - 1)
        if index not in indices:
            indices.append(index)
            data = gk[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    while len(indices) < 9:
        index = random.randint(0, len(cb) - 1)
        if index not in indices:
            indices.append(index)
            data = cb[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    while len(indices) < 15:
        index = random.randint(0, len(fb) - 1)
        if index not in indices:
            indices.append(index)
            data = fb[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    while len(indices) < 21:
        index = random.randint(0, len(cm) - 1)
        if index not in indices:
            indices.append(index)
            data = cm[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    while len(indices) < 27:
        index = random.randint(0, len(w) - 1)
        if index not in indices:
            indices.append(index)
            data = w[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    while len(indices) < 33:
        index = random.randint(0, len(st) - 1)
        if index not in indices:
            indices.append(index)
            data = st[index]
            res[len(indices)] = [data["Name"], data["Value"]]
    return jsonify(res)

@app.route('/api/fiveaside', methods=["GET", "POST"])
def fiveaside():
    res = {}
    atts = []
    defs = []
    gks = []
    valid_att = ["ST", "LW", "RW", "CAM", "CM", "CF", "LM", "RM"]
    valid_def = ["LB", "RB", "CB", "CDM", "LWB", "RWB", "CM", "LM", "RM"]
    players = list(eafc.find({}))
    while len(atts) < 8 or len(defs) < 8 or len(gks) < 4:
        index = random.randint(0, len(players) - 1)
        pos = players[index]["Position"]
        if index not in defs and index not in atts and pos in valid_def and len(atts) < 8:
            defs.append(index)
        elif index not in atts and index not in defs and pos in valid_att and len(atts) < 8:
            atts.append(index)
        elif index not in gks and pos == "GK" and len(gks) < 4:
            gks.append(index)
    num = 1
    for i in atts[:2]:
        data = players[i]
        res["ATT1_" + str(num)] = data["Name"]
        num += 1
    num = 1
    for i in defs[:2]:
        data = players[i]
        res["DEF1_" + str(num)] = data["Name"]
        num += 1
    data = players[gks[0]]
    res["GK1_1"] = data["Name"]

    num = 1
    for i in atts[-6:]:
        data = players[i]
        res["ATT2_" + str(num)] = data["Name"]
        num += 1
    num = 1
    for i in defs[-6:]:
        data = players[i]
        res["DEF2_" + str(num)] = data["Name"]
        num += 1
    num = 1
    for i in gks[-3:]:
        data = players[i]
        res["GK2_" + str(num)] = data["Name"]
        num += 1

    return jsonify(res)

@app.route("/api/fiveasidescore", methods=["GET", "POST"])
def fiveasidescore():
    ratings = []
    if request.method == "POST":
        data = list(request.get_json()["selectedPlayers"])
    else:
        data = ["Rodri", "Rodri", "Rodri", "Rodri", "Rodri", "Rodri", "Rodri", "Rodri", "Rodri", "Rodri"]
    for player in data:
        rating = list(eafc.find({"Name": player}))[0]["Rating"]
        ratings.append(int(rating))

    total1 = sum(ratings[:5])
    total2 = sum(ratings[-5:])
    diff = abs(total1 - total2)

    if diff <= 2:
        res = "Draw"
    elif total1 < total2:
        res = "Win"
    else:
        res = "Loss"

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

    return f"{winner}-{loser} " + res

@app.route('/api/blindrank', methods=["GET", "POST"])
def blindrank():
    att = ["ST", "LW", "RW", "CAM", "CF", "LM", "RM"]
    mid = ["CM", "CDM", "CAM"]
    d = ["LB", "RB", "CB", "LWB", "RWB"]
    gk = ["GK"]
    pos = [att, mid, d, gk]
    posIndex = random.randint(0, 3)
    posList = pos[posIndex]
    players = list(eafc.find({"Position": {"$in": posList}}))
    indices = []
    res = {}
    while len(indices) < 5:
        index = random.randint(0, len(players) - 1)
        if index not in indices:
            indices.append(index)
    indices.sort()
    j = 1
    for i in indices:
        data = players[i]
        res[data["Name"]] = j
        j += 1
    return res

@app.route('/api/whoscored', methods=["GET", "POST"])
def whoscored():
    today = datetime.now()
    day_num = today.timetuple().tm_yday
    data = list(videos.find({}))
    vids = len(data)
    index = day_num % vids
    video = data[index]
    video["_id"] = str(video["_id"])
    return video

# @app.route('/api/playernames', methods=["GET", "POST"])
# def playernames():
#     values = eafc.find({}, {"Name": 1, '_id': 0})
#     values_list = [doc["Name"] for doc in values if "Name" in doc]
#     return values_list


headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36'}

def updateTransfer():
    def pageData(num):
        page = f"https://www.transfermarkt.us/spieler-statistik/wertvollstespieler/marktwertetop?page={num}"
        pageTree = requests.get(page, headers=headers)
        pageSoup = BeautifulSoup(pageTree.content, 'html.parser')
        
        players = pageSoup.find_all("img", class_="bilderrahmen-fixed")
        values = pageSoup.find_all(class_="rechts hauptlink")
        positions = pageSoup.find_all("table", class_="inline-table")
        
        pList = []
        vList = []
        posList = []
        
        for item in players:
            split = str(item).split('"')
            pList.append(split[1])
            
        for item in values:
            split = str(item).split("€")
            splitAgain = split[1].split("m")
            vList.append(splitAgain[0])
            
        for item in positions:
            split = str(item).split("<td>")[-1]
            splitAgain = split.split("</td>")[0]
            if splitAgain == "Centre-Forward" or splitAgain == "Second Striker":
                splitAgain = "ST"
            elif splitAgain == "Left Winger" or splitAgain == "Right Winger" or splitAgain == "Left Midfield" or splitAgain == "Right Midfield":
                splitAgain = "W"
            elif splitAgain == "Attacking Midfield" or splitAgain == "Defensive Midfield" or splitAgain == "Central Midfield":
                splitAgain = "CM"
            elif splitAgain == "Left-Back" or splitAgain == "Right-Back":
                splitAgain = "FB"
            elif splitAgain == "Centre-Back":
                splitAgain = "CB"
            elif splitAgain == "Goalkeeper":
                splitAgain = "GK"
            posList.append(splitAgain)
            
        return pList, vList, posList
    pList = []
    vList = []
    posList = []
    for j in range(1, 15):
        data = pageData(j)
        pList += data[0]
        vList += data[1]
        posList += data[2]
    newData = []
    for i in range(len(pList)):
        player = {
            "Name": pList[i],
            "Position": posList[i],
            "Value": vList[i]
        }
        newData.append(player)

    transfer.delete_many({})
    transfer.insert_many(newData)

def updateRatings():
    page = "https://www.fifaratings.com/players"
    pageTree = requests.get(page, headers=headers)
    pageSoup = BeautifulSoup(pageTree.content, 'html.parser')

    positions = pageSoup.find_all("span", class_="entry-subtext-font")
    players = pageSoup.find_all("span", class_="entry-font entry-font-narrow")
    countries = pageSoup.find_all("div", class_="all-star-badge-list")
    teams = pageSoup.find_all("a", class_="text-dark")
    ratings = pageSoup.find_all("span")

    playersList = []
    for item in players:
        split = str(item).split('>')
        splitAgain = split[2].split('<')
        playersList.append(splitAgain[0])

    positionsList = []
    for item in positions:
        split = str(item).split("> ")
        splitAgain = split[2].split("<")
        positionsList.append(splitAgain[0])

    countriesList = []
    for item in countries:
        split = str(item).split('<img alt="')[1]
        splitAgain = split.split('"')[0]
        countriesList.append(splitAgain)
    countriesList.insert(90, "Uruguay")

    teamsList = []
    for item in teams:
        split = str(item).split('title="')[1]
        splitAgain = split.split('"')[0]
        teamsList.append(splitAgain)

    ratingsList = []
    lst = ratings[8:]
    i = 0
    while i < len(lst):
        rating = str(lst[i])
        split = rating.split('">')[1]
        splitAgain = split.split("</span>")[0]
        ratingsList.append(splitAgain)
        i += 13

    newData = []
    for i in range(len(playersList)):
        player = {
            "Name": playersList[i],
            "Position": positionsList[i],
            "Club": teamsList[i],
            "Country": countriesList[i],
            "Rating": ratingsList[i]
        }
        newData.append(player)

    eafc.delete_many({})
    eafc.insert_many(newData)

# updateRatings()
# updateTransfer()

if __name__ == "__main__":
    app.run(port=3000)