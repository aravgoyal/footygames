/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

interface Player {
    name: string;
    value: number;
}

export function TransferXI() {
    let totalValue = 0;
    let positionIndex = 0;
    let availablePlayers: Player[][] = [];
    let currentPlayers: Player[] | null = [];
    const positions: Element[] = [];
    let currentPosition: Element | null = null;

    const positionOrder = [
        "GK", "LCB", "RCB", "LB", "RB", 
        "LCM", "RCM", "LM", "RM", 
        "LS", "RS"
    ];

    const fetchPlayers = async (): Promise<Player[][]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/transferxi');
            const playersData: { [key: string]: [string, number] } = response.data;

            const players: Player[] = Object.values(playersData).map((data: [string, number]) => ({
                name: data[0],
                value: data[1],
            }));

            const playerGroups: Player[][] = [];

            for (let i = 0; i < players.length; i += 3) {
                playerGroups.push(players.slice(i, i + 3));
            }

            return playerGroups;
        } catch (error) {
            console.error('Error fetching players:', error);
            return [];
        }
    };

    const generatePlayerOptions = () => {
        currentPlayers = availablePlayers.shift() || null;
        currentPosition = positions[positionIndex] || null;
        currentPosition.classList.add("current")
        const currentPlayersDisplay = document.querySelectorAll('.option');

        if (currentPlayers) {
            currentPlayers.forEach((player, index) => {
                const element = currentPlayersDisplay[index];
                if (element) {
                    element.textContent = player.name;
                    element.setAttribute('data-player-index', index.toString());
                }
            });
        } else if (positionIndex == 1) {
            currentPlayersDisplay.forEach(element => element.classList.add("hide"));
        }
    };

    const choosePlayer = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const playerIndex = target.getAttribute('data-player-index');

        if (!currentPlayers || playerIndex === null || !currentPosition) {
            return;
        }

        const selectedPlayer = currentPlayers[parseInt(playerIndex)];
        currentPosition.textContent = `€${selectedPlayer.value}m`;
        currentPosition.classList.add('filled');
        currentPosition.classList.remove("selected");

        totalValue += selectedPlayer.value;

        const totalValueDisplay = document.getElementById('total-value') as HTMLSpanElement;
        totalValueDisplay.textContent = totalValue.toString();

        positionIndex += 1;
        generatePlayerOptions();
    };

    const initializeGame = async () => {
        availablePlayers = await fetchPlayers();
        const positionNodeList = document.querySelectorAll('.position');

        positionOrder.forEach((position, index) => {
            const positionElement = Array.from(positionNodeList).find(node => node.getAttribute('data-position') === position);
            if (positionElement) {
                positions[index] = positionElement;
            }
        });

        const options = document.querySelectorAll('.option');
        options.forEach((option) => {
            option.addEventListener('click', choosePlayer);
        });

        generatePlayerOptions();
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div className='transferxi'>
            <h1>Transfer XI</h1>
            <p>Goal: €1b</p>
            <div id="team-container">
                <div className="position" data-position="LS">ST</div>
                <div className="position" data-position="RS">ST</div>
                <div className="position" data-position="LM">LM</div>
                <div className="position" data-position="LCM">CM</div>
                <div className="position" data-position="RCM">CM</div>
                <div className="position" data-position="RM">RM</div>
                <div className="position" data-position="LB">LB</div>
                <div className="position" data-position="LCB">CB</div>
                <div className="position" data-position="RCB">CB</div>
                <div className="position" data-position="RB">RB</div>
                <div className="position" data-position="GK">GK</div>
            </div>
            <div id="players-container">
                <div className="option" data-option="1">Loading...</div>
                <div className="option" data-option="2">Loading...</div>
                <div className="option" data-option="3">Loading...</div>
            </div>
            <h2 id="value-display">
                Team Value: €<span id="total-value">0</span>m
            </h2>
        </div>
    );
}