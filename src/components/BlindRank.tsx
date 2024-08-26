/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

interface RankedPlayer {
    name: string;
    rank: number;
}

export function BlindRank() {
    let count = 0;
    let availablePlayers: RankedPlayer[] = [];
    let allPlayers: RankedPlayer[] = [];
    let currentPlayer: RankedPlayer | null = null;
    const positionsFilled: Set<string> = new Set();

    const fetchPlayers = async (): Promise<RankedPlayer[]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/blindrank');
            const playersData = response.data;

            const players: RankedPlayer[] = Object.keys(playersData).map(name => ({
                name,
                rank: playersData[name],
            }));

            return players;
        } catch (error) {
            console.error('Error fetching players:', error);
            return [];
        }
    };

    const generatePlayer = () => {
        currentPlayer = availablePlayers.shift() || null;

        const currentPlayerDisplay = document.getElementById('current-player') as HTMLDivElement;
        
        if (currentPlayer) {
            currentPlayerDisplay.textContent = currentPlayer.name;
        }

        if (count == 5) {
            currentPlayerDisplay.textContent = "";
            const positions = document.querySelectorAll('.rank');

            positions.forEach((position) => {
                allPlayers.forEach((player) => {
                    if (player.name == position.textContent) {
                        position.textContent = player.rank + " " + position.textContent
                    }
                })
            });
        }
    };

    const placePlayer = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const position = target.dataset.position;

        if (!currentPlayer || target.classList.contains('filled') || !position) {
            return;
        }

        target.textContent = currentPlayer.name;
        target.classList.add('filled');
        positionsFilled.add(position);
        
        count += 1;

        generatePlayer();

    };

    const initializeGame = async () => {
        availablePlayers = await fetchPlayers();
        allPlayers = [...availablePlayers]
        const positions = document.querySelectorAll('.rank');

        positions.forEach((position) => {
            position.addEventListener('click', placePlayer);
        });

        generatePlayer();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <><a className="back-home" href="/">Home</a><div>
            <h1>Blind Rank</h1>
            <p>Rank current players!</p>
            <div id="blindrank-container">
                <div className="rank" data-position="first">1</div>
                <div className="rank" data-position="second">2</div>
                <div className="rank" data-position="third">3</div>
                <div className="rank" data-position="fourth">4</div>
                <div className="rank" data-position="fifth">5</div>
            </div>
            <div id="current-player"></div>
        </div></>
    );
}