/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

export function WhoScored() {
    let url = "https://www.youtube.com/embed/Ml5PNPdDInI?si=uENiBNO2kOC4eYeR&amp;controls=0"
    let player = "Player"
    let lives = 3

    const fetchVideo = async (): Promise<string[]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/whoscored');
            const videoData = response.data;

            const answer = Object.keys(videoData)[0]
            const link = videoData[answer]

            return [link, answer];
        } catch (error) {
            console.error('Error fetching video:', error);
            return [];
        }
    };

    const fetchPlayers = async (): Promise<string[]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/playernames');
            const players = response.data;

            return players;
        } catch (error) {
            console.error('Error fetching players:', error);
            return [];
        }
    }

    const submit = () => {
        const guess = document.getElementById('guess') as HTMLInputElement
        const result = document.getElementById('result') as HTMLSpanElement
        const livesDisplay = document.getElementById("lives") as HTMLSpanElement
        const button = document.getElementById("submit") as HTMLButtonElement;
        if (guess.value == player) {
            result.textContent = "Correct!";
            livesDisplay.textContent = ""
            guess.value = ""
            button.classList.add("over")
        } else if (!button.classList.contains("over")) {
            lives -= 1;
        }
        if (lives <= 0) {
            result.textContent = player
            lives = 0
            button.classList.add("over")
        }
        livesDisplay.textContent = lives.toString()

    }

    const initializeGame = async () => {
        const data = await fetchVideo();
        url = data[0]
        player = data[1]

        const players = await fetchPlayers();
        const list = document.getElementById("playerlist") as HTMLDataListElement

        players.forEach((item) => {
            const option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
         });

        const livesDisplay = document.getElementById("lives") as HTMLSpanElement
        livesDisplay.textContent = lives.toString()
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div>
            <h1>Who Scored?</h1>
            <div>
            <iframe width="560" height="315" src={url} title="Who Scored?" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
            <h2>Lives: <span id="lives"></span></h2>
            <input type="search" list="mylist" id="guess"></input>
            <datalist id="playerlist">
            <option value="Dany Urizar" />
            </datalist>
            <button id="submit" onClick={submit}>Guess</button>
            <h2><span id="result"></span></h2>
        </div>
    )
}