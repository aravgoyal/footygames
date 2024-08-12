from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bs4 import BeautifulSoup
import requests

uri = "mongodb+srv://aravgoyal:9bEm16wiXThGu7Ac@footygames.jwayt.mongodb.net/?retryWrites=true&w=majority&appName=FootyGames"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["footygames"]
eafc = db["eafctop100"]
transfer = db["transfervalues"]

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

updateRatings()
updateTransfer()