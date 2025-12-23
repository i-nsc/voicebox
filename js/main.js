// ==========================================
// CONFIGURATION
// ==========================================
const config = {
    love: 5,    // Number of love_x.m4a files
    tarot: 0    // Coming soon
};

// ==========================================
// LOAD ANSWERS
// ==========================================
let bookAnswers = [];

fetch('js/answers.json')
    .then(response => response.json())
    .then(data => {
        bookAnswers = [...data.good, ...data.neutral, ...data.bad];
        console.log("Answers loaded:", bookAnswers.length);
    })
    .catch(error => {
        console.error("Error loading answers:", error);
        bookAnswers = ["Yes", "No", "Maybe"]; 
    });

let currentAudio = null;

function openTab(evt, tabName) {
    // 1. UI Updates
    const contents = document.querySelectorAll('.content-area');
    contents.forEach(div => div.classList.remove('active'));
    
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');

    // 2. STOP ALL AUDIO
    stopAllAudio();
}

function stopAllAudio() {
    // Stop the random clips (Love tab)
    if(currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        clearStatus();
    }

    // Stop the Listen tab player
    const listenPlayer = document.getElementById('listen-player');
    if(listenPlayer) {
        listenPlayer.pause();
    }
}

// ==========================================
// LOVE TAB LOGIC
// ==========================================
function playAudio(category) {
    const maxFiles = config[category];
    const statusDiv = document.getElementById(`status-${category}`);

    if (!maxFiles || maxFiles === 0) {
        statusDiv.innerText = "Coming soon...";
        return;
    }

    // Stop other audio first
    stopAllAudio();

    const randomNum = Math.floor(Math.random() * maxFiles) + 1;
    const filePath = `media/audio/${category}_${randomNum}.m4a`;

    currentAudio = new Audio(filePath);
    statusDiv.innerText = "Playing track #" + randomNum + "...";

    currentAudio.play().catch(e => {
        statusDiv.innerText = "Error: File not found!";
    });

    currentAudio.onended = () => {
        statusDiv.innerText = "Done.";
    };
}

// ==========================================
// LISTEN TAB LOGIC (Dropdown System)
// ==========================================
function changeTrack() {
    const select = document.getElementById('track-select');
    const player = document.getElementById('listen-player');
    const statusDiv = document.getElementById('status-listen');
    
    const selectedFile = select.value;
    const selectedTitle = select.options[select.selectedIndex].text;

    // Stop Love audio if playing
    if(currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    if(selectedFile) {
        player.src = `media/audio/${selectedFile}`;
        player.load();
        
        player.play().then(() => {
            statusDiv.innerText = "Now Playing: " + selectedTitle;
        }).catch(e => {
            statusDiv.innerText = "Error: File not found.";
        });
    }
}

// ==========================================
// ANSWER TAB LOGIC
// ==========================================
function getAnswer() {
    const display = document.getElementById('answer-display');
    
    if (bookAnswers.length === 0) {
        display.innerText = "Loading...";
        return;
    }

    display.classList.remove('show');
    
    setTimeout(() => {
        const randomAnswer = bookAnswers[Math.floor(Math.random() * bookAnswers.length)];
        display.innerText = randomAnswer;
        display.classList.add('show');
    }, 200);
}

function clearStatus() {
    document.querySelectorAll('.status-text').forEach(el => el.innerText = '');
}
