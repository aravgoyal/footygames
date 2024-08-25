/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect } from 'react';

export function WhoScored() {
    let code = "sDZTrMyPP0g?si=W2WujOhCnHsnHaVR"
    let url = "https://www.youtube.com/embed/" + code + "&amp;controls=0"
    let player = "Player"
    let position = "Position"
    let nation = "Nation"
    let club = "Club"
    let lives = 3

    const fetchVideo = async (): Promise<string[]> => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/whoscored');
            const videoData = response.data;

            const answer = videoData["Player"]
            const link = videoData["URL"]
            const club = videoData["Club"]
            const nation = videoData["Nation"]
            const position = videoData["Position"]

            return [link, answer, position, nation, club];
        } catch (error) {
            console.error('Error fetching video:', error);
            return [];
        }
    };

    const submit = () => {
        const guess = document.getElementById('guess') as HTMLInputElement
        const result = document.getElementById('result') as HTMLSpanElement
        const livesDisplay = document.getElementById("lives") as HTMLSpanElement
        const hint2Display = document.getElementById("hint2") as HTMLSpanElement
        const hint3Display = document.getElementById("hint3") as HTMLSpanElement
        const button = document.getElementById("submit") as HTMLButtonElement;
        if (guess.value == player) {
            result.textContent = "Correct!";
            result.classList.add('visible');
            livesDisplay.textContent = ""
            guess.value = ""
            button.classList.add("over")
        } else if (!button.classList.contains("over")) {
            lives -= 1;
        }
        if (lives == 2) {
            hint2Display.textContent = nation
            hint2Display.classList.add('visible');
        } else if (lives == 1) {
            hint3Display.textContent = club
            hint3Display.classList.add('visible');
        } else if (lives <= 0) {
            result.textContent = player
            result.classList.add('visible');
            lives = 0
            button.classList.add("over")
        }
        livesDisplay.textContent = lives.toString()

    }

    const initializeGame = async () => {
        const data = await fetchVideo();
        code = data[0]
        url = "https://www.youtube.com/embed/" + code + "&amp;controls=0"

        const videoPlayer = document.getElementById("videoPlayer") as HTMLIFrameElement
        videoPlayer.src = url

        player = data[1]
        position = data[2]
        nation = data[3]
        club = data[4]

        const livesDisplay = document.getElementById("lives") as HTMLSpanElement
        livesDisplay.textContent = lives.toString()

        const hint1Display = document.getElementById("hint1") as HTMLSpanElement
        hint1Display.textContent = position
    };

    useEffect(() => {
        initializeGame();
    }, []);

    return (
        <div>
            <h1>Who Scored?</h1>
            <div>
            <iframe id="videoPlayer" width="560" height="315" src={url} title="Who Scored?" frameBorder={0} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
            <h2>Lives: <span id="lives"></span></h2>
            <div id='hint-container'>
                <h5><span id="hint2" className='fade-in'></span></h5>
                <h5><span id="hint1" className='hint'>Loading...</span></h5>
                <h5><span id="hint3" className='fade-in'></span></h5>
            </div>
            <input type="search" list="mylist" id="guess"></input>
            <button id="submit" onClick={submit}>Guess</button>
            <h2><span id="result" className='result-whoscored'></span></h2>
        </div>
    )
}