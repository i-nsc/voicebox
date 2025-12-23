// ==========================================
// CONFIGURATION
// ==========================================
const config = {
    love: 5,    // Number of love_x.mp3 files
    tarot: 0    // Coming soon
};

// ==========================================
// BOOK OF ANSWERS - TEXT LIST
// You can edit these answers!
// ==========================================
const bookAnswers = [
    "Yes, absolutely!",
    "It is certain.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];

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

    // 5. STOP ALL AUDIO (Both the random clips AND the relax player)
    
    // Stop random clips
    if(currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        clearStatus();
    }

    // Stop Relax Player
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
    
    // Fade out
    display.classList.remove('show');
    
    setTimeout(() => {
        // Pick random answer
        const randomAnswer = bookAnswers[Math.floor(Math.random() * bookAnswers.length)];
        display.innerText = randomAnswer;
        
        // Fade in
        display.classList.add('show');
    }, 200);
}

function clearStatus() {
    document.querySelectorAll('.status-text').forEach(el => el.innerText = '');
}