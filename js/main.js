// ==========================================
// CONFIGURATION
// ==========================================
const config = {
    love: 5,    // Update this to match how many love_x.mp3 files you have
    tarot: 0    // Set to 0 since it is coming soon
};

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

    // 5. Stop any playing audio if we switch tabs
    if(currentAudio) {
        currentAudio.pause();
        currentAudio = null;
        clearStatus();
    }
}

function playAudio(category) {
    const maxFiles = config[category];
    const statusDiv = document.getElementById(`status-${category}`);

    if (!maxFiles || maxFiles === 0) {
        statusDiv.innerText = "Coming soon...";
        return;
    }

    // Stop currently playing audio if any
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // Pick random number
    const randomNum = Math.floor(Math.random() * maxFiles) + 1;
    
    // IMPORTANT: This path points to the media/audio folder
    const filePath = `media/audio/${category}_${randomNum}.mp3`;

    // Create and play audio
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

function clearStatus() {
    document.querySelectorAll('.status-text').forEach(el => el.innerText = '');
}