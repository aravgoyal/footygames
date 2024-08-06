/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

interface Player {
    name: string;
    value: number;
}

export function TransferXI() {
    let totalValue = 0;
    let availablePlayers: Player[] = [];
    let currentPlayer: Player | null = null;
    const positionsFilled: Set<string> = new Set();

    const fetchPlayers = async (): Promise<Player[]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/transferxi');
            const playersData = response.data;

            const players: Player[] = Object.keys(playersData).map(name => ({
                name,
                value: playersData[name],
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
    };

    const placePlayer = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const position = target.dataset.position;

        if (!currentPlayer || target.classList.contains('filled') || !position) {
            return;
        }

        target.textContent = `€${currentPlayer.value}m`;
        target.classList.add('filled');
        positionsFilled.add(position);
        totalValue += currentPlayer.value;

        const totalValueDisplay = document.getElementById('total-value') as HTMLSpanElement;
        totalValueDisplay.textContent = totalValue.toString();

        generatePlayer();

    };

    const initializeGame = async () => {
        availablePlayers = await fetchPlayers();
        const positions = document.querySelectorAll('.position');

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
            <div id="current-player"></div>
            <h2>
                Team Value: €<span id="total-value">0</span>m
            </h2>
        </div>
    );
}