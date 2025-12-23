// ==========================================
// CONFIGURATION
// ==========================================
const config = {
    love: 5,    // Number of love_x.mp3 files
    tarot: 0    // Coming soon
};

// We will load the answers into this variable
let bookAnswers = [];

// Load the answers immediately when the page loads
fetch('js/answers.json')
    .then(response => response.json())
    .then(data => {
        // The JSON now has 3 categories. We need to merge them 
        // into one single list so we can pick a random one.
        bookAnswers = [
            ...data.good, 
            ...data.neutral, 
            ...data.bad
        ];
        console.log("Answers loaded successfully. Total answers:", bookAnswers.length);
    })
    .catch(error => {
        console.error("Error loading answers:", error);
        bookAnswers = ["Yes", "No", "Maybe"]; // Fallback
    });

let currentAudio = null;

function openTab(evt, tabName) {
    // 1. Hide all content areas
    const contents = document.querySelectorAll('.content-area');
    contents.forEach(div => div.classList.remove('active'));
    
    // 2. Remove 'active' class from all buttons
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    // 3. Show the specific tab content
    document.getElementById(tabName).classList.add('active');
    
    // 4. Add 'active' class to the button that was clicked
    evt.currentTarget.classList.add('active');

    // 5. STOP ALL AUDIO
    if(currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        clearStatus();
    }

    const relaxPlayer = document.getElementById('relax-player');
    if(relaxPlayer) {
        relaxPlayer.pause();
    }
}

function playAudio(category) {
    const maxFiles = config[category];
    const statusDiv = document.getElementById(`status-${category}`);

    if (!maxFiles || maxFiles === 0) {
        statusDiv.innerText = "Coming soon...";
        return;
    }

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    const randomNum = Math.floor(Math.random() * maxFiles) + 1;
    const filePath = `media/audio/${category}_${randomNum}.mp3`;

    currentAudio = new Audio(filePath);
    statusDiv.innerText = "Playing track #" + randomNum + "...";

    currentAudio.play().catch(e => {
        statusDiv.innerText = "Error: File not found!";
        console.error("Could not find file:", filePath);
    });

    currentAudio.onended = () => {
        statusDiv.innerText = "Done.";
    };
}

function getAnswer() {
    const display = document.getElementById('answer-display');
    
    // Safety check
    if (bookAnswers.length === 0) {
        display.innerText = "Loading...";
        return;
    }

    // Fade out
    display.classList.remove('show');
    
    setTimeout(() => {
        // Pick random answer from the combined list
        const randomAnswer = bookAnswers[Math.floor(Math.random() * bookAnswers.length)];
        display.innerText = randomAnswer;
        
        // Fade in
        display.classList.add('show');
    }, 200);
}

function clearStatus() {
    document.querySelectorAll('.status-text').forEach(el => el.innerText = '');
}