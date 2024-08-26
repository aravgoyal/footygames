/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

interface Game {
    team1: string[];
    team2: string[][];
    result: string;
    score: string;
}

export function FiveASide() {
    let positionIndex = 0;
    let availablePlayers: string[][] = [];
    let currentPlayers: string[] | null = null;
    const selectedPlayers: string[] = []
    let game: Game | null = null;
    const positions: Element[] = [];
    let currentPosition: Element | null = null;

    const positionOrder = ["ATT1_2", "ATT2_2", "DEF1_2", "DEF2_2", "GK2"];

    const fetchPlayers = async (): Promise<Game> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/fiveaside');
            const gameData = response.data;

            const currentGame: Game = {
                team1: [gameData["ATT1_1"], gameData["ATT1_2"], gameData["DEF1_1"], gameData["DEF1_2"], gameData["GK1_1"]],
                team2: [
                    [gameData.ATT2_1, gameData.ATT2_2, gameData.ATT2_3],
                    [gameData.ATT2_4, gameData.ATT2_5, gameData.ATT2_6],
                    [gameData.DEF2_1, gameData.DEF2_2, gameData.DEF2_3],
                    [gameData.DEF2_4, gameData.DEF2_5, gameData.DEF2_6],
                    [gameData.GK2_1, gameData.GK2_2, gameData.GK2_3]
                ],
                result: gameData["Result"],
                score: gameData["Score"]
            }

            return currentGame
        } catch (error) {
            console.error('Error fetching players:', error);

            const empty: Game = {
                team1: [],
                team2: [],
                result: "",
                score: ""
            };

            return empty;
        }
    }

    const fetchScore = async (): Promise<string> => {
        const team2 = document.querySelectorAll(".pos52")
        team2.forEach((element) => {
            const player = element.textContent || ""; 
            selectedPlayers.push(player);
        })
        return axios.post('http://127.0.0.1:3000/api/fiveasidescore', { selectedPlayers })
            .then(response => {
                return response.data
            });
    }

    const generatePlayers = async () => {
        if (positionIndex < positions.length) {
            currentPlayers = availablePlayers.shift() || null;
            currentPosition = positions[positionIndex] || null;

            if (currentPosition) {
                currentPosition.classList.add("current");
            }

            const currentPlayersDisplay = document.querySelectorAll('.option');

            if (currentPlayers) {
                currentPlayers.forEach((player, index) => {
                    const element = currentPlayersDisplay[index];
                    if (element) {
                        element.textContent = player;
                        element.setAttribute('data-player-index', index.toString());
                    }
                });
            }
        } else {
            const resultDisplay = document.getElementById("result");
            if (resultDisplay) {
                resultDisplay.textContent = "Loading...";
            }
            const options = document.querySelectorAll('.option');
            options.forEach((option) => {
                option.removeEventListener('click', choosePlayer);
            });

            const result = await fetchScore();
            if (resultDisplay) {
                resultDisplay.textContent = result;
            }
        }
    };

    const choosePlayer = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const playerIndex = target.getAttribute('data-player-index');

        if (!currentPlayers || playerIndex === null || !currentPosition) {
            return;
        }

        const selectedPlayer = currentPlayers[parseInt(playerIndex)];
        currentPosition.textContent = selectedPlayer;
        currentPosition.classList.add('filled');
        currentPosition.classList.remove("selected");

        positionIndex += 1;
        generatePlayers();
    };

    const initializeGame = async () => {
        game = await fetchPlayers();
        availablePlayers = game.team2;

        const positionNodeList = document.querySelectorAll('.pos52');

        positionOrder.forEach((position, index) => {
            const positionElement = Array.from(positionNodeList).find(node => node.getAttribute('data-position') === position);
            if (positionElement) {
                positions[index] = positionElement;
            }
        });

        let opponent: string = "Player"
        const team1pos = document.querySelectorAll('.pos51');
        team1pos.forEach((position) => {
            opponent = game?.team1.shift() || "Player"
            selectedPlayers.push(opponent);
            position.textContent = opponent;
        });

        const options = document.querySelectorAll('.option');
        options.forEach((option) => {
            option.addEventListener('click', choosePlayer);
        });

        generatePlayers();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <><a className="back-home" href="/">Home</a><div>
            <h1>Five-A-Side</h1>
            <p>Beat your opponent!</p>
            <div id="fiveaside-container">
                <div className="pos51" data-position="ATT1_1">Loading...</div>
                <div className="pos51" data-position="ATT2_1">Loading...</div>
                <div className="pos51" data-position="DEF1_1">Loading...</div>
                <div className="pos51" data-position="DEF2_1">Loading...</div>
                <div className="pos51" data-position="GK1">Loading...</div>
                <div className="pos52" data-position="ATT1_2">+</div>
                <div className="pos52" data-position="ATT2_2">+</div>
                <div className="pos52" data-position="DEF1_2">+</div>
                <div className="pos52" data-position="DEF2_2">+</div>
                <div className="pos52" data-position="GK2">GK</div>
            </div>
            <div id="players-container-fiveaside">
                <div className="option" data-option="1">Loading...</div>
                <div className="option" data-option="2">Loading...</div>
                <div className="option" data-option="3">Loading...</div>
            </div>
            <h2 id="result"></h2>
        </div></>
    );
}