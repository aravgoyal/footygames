/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

interface Game {
    team1: string[];
    team2: string[];
    result: string;
    score: string;
}

export function FiveASide() {
    let count = 0
    let availablePlayers: string[] = [];
    let currentPlayer: string | null = null;
    let game: Game | null = null;
    const positionsFilled: Set<string> = new Set();

    const shuffle = (array: string[]): string[] => {
        let currentIndex = array.length,  randomIndex;
    
        while (currentIndex != 0) {
      
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    };

    const fetchPlayers = async (): Promise<Game> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/fiveaside');
            const gameData = response.data;

            const currentGame: Game = {
                team1: [gameData["ATT1_1"], gameData["ATT1_2"], gameData["DEF1_1"], gameData["DEF1_2"], gameData["GK1"]],
                team2: shuffle([gameData["ATT2_1"], gameData["ATT2_2"], gameData["DEF2_1"], gameData["DEF2_2"], gameData["GK2"]]),
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

    const generatePlayer = () => {
        currentPlayer = availablePlayers.shift() || null;

        const currentPlayerDisplay = document.getElementById('current-player') as HTMLDivElement;
        if (currentPlayer) {
            currentPlayerDisplay.textContent = currentPlayer;
        } else if (game || count == 5) {
            currentPlayerDisplay.textContent = game?.score + " " + game?.result
        }
    };

    const placePlayer = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const position = target.dataset.position;

        if (!currentPlayer || target.classList.contains('filled') || !position) {
            return;
        }

        target.textContent = currentPlayer;
        target.classList.add('filled');
        positionsFilled.add(position);
        count += 1;

        generatePlayer();

    };

    const initializeGame = async () => {
        game = await fetchPlayers();
        availablePlayers = game.team2;

        let opponent: string = "Player"

        const team1pos = document.querySelectorAll('.pos51');
        team1pos.forEach((position) => {
            opponent = game?.team1.shift() || "Player"
            position.textContent = opponent;
        });

        const positions = document.querySelectorAll('.pos52');
        positions.forEach((position) => {
            position.addEventListener('click', placePlayer);
        });

        generatePlayer();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div>
            <h1>Five-A-Side</h1>
            <p>Beat your opponent!</p>
            <div id="fiveaside-container">
                <div className="pos51" data-position="ATT1_1">Loading...</div>
                <div className="pos51" data-position="ATT2_1">Loading...</div>
                <div className="pos51" data-position="DEF1_1">Loading...</div>
                <div className="pos51" data-position="DEF2_1">Loading...</div>
                <div className="pos51" data-position="GK1">Loading...</div>
                <div className="pos52" data-position="ATT1_2">FW</div>
                <div className="pos52" data-position="ATT2_2">FW</div>
                <div className="pos52" data-position="DEF1_2">DEF</div>
                <div className="pos52" data-position="DEF2_2">DEF</div>
                <div className="pos52" data-position="GK2">GK</div>
            </div>
            <div id="current-player"></div>
        </div>
    );
}