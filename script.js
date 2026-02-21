let audioElement = new Audio();
let showPlaying = false;
let songIndex = 0;
let playlist = [];

// Load playlist from JSON
async function loadPlaylist() {
  try {
    const resp = await fetch("playlist.json");
    playlist = await resp.json();
    console.log("Loaded playlist:", playlist);
  } catch (e) {
    console.error("Failed to load playlist.json", e);
  }
}

// Update mode display
function updateMode(text) {
  document.getElementById("mode").innerText = "Current Mode: " + text;
}

// Idle mode
function setIdle() {
  stopShow();
  stopQuestions();
  updateMode("Idle");
}

// Show Time mode
function startShow() {
  stopQuestions();
  stopShow();
  showPlaying = true;
  if (playlist.length === 0) loadPlaylist().then(() => playNextSong());
  else playNextSong();
  audioElement.onended = playNextSong;
  updateMode("Show Time");
}

function playNextSong() {
  if (!showPlaying || playlist.length === 0) return;
  audioElement.src = playlist[songIndex];
  audioElement.play();
  songIndex = (songIndex + 1) % playlist.length;
}

function stopShow() {
  showPlaying = false;
  audioElement.pause();
  audioElement.src = "";
}

// Simulated Question Mode
function startQuestions() {
  stopShow();
  updateMode("Question Mode (Simulated)");
  const chatBox = document.getElementById("chat");
  chatBox.innerHTML = "";

  const lines = [
    "Hello kids! Welcome to the stage!",
    "I have a surprise for everyone… follow me!",
    "The lights are dim, but don’t worry, the fun is just beginning!",
    "Who wants pizza parties and arcade games?",
    "Remember, the show must go on!"
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i >= lines.length) clearInterval(interval);
    else {
      const p = document.createElement("div");
      p.textContent = lines[i];
      chatBox.appendChild(p);
      chatBox.scrollTop = chatBox.scrollHeight;
      speakLine(lines[i]);
      i++;
    }
  }, 3000);
}

// Stop Question Mode
function stopQuestions() {
  console.log("Question Mode stopped (simulated)");
}

// Voice commands
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = new SpeechRecognition();
recognizer.continuous = true;
recognizer.interimResults = false;
recognizer.lang = "en-US";

recognizer.onresult = (event) => {
  let last = event.results[event.results.length - 1][0].transcript
    .toLowerCase()
    .trim();
  console.log("Heard:", last);

  if (last.includes("spring bonnie enter stage mode")) {
    speakLine("Returning to stage performance.");
    startShow();
  } else if (last.includes("spring bonnie sleep")) {
    speakLine("Entering rest mode.");
    setIdle();
  } else if (last.includes("spring bonnie question mode")) {
    speakLine("Entering question mode.");
    startQuestions();
  }
};

recognizer.start();

// Text-to-speech
function speakLine(text) {
  const speech = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  speech.voice =
    voices.find((v) => v.name.includes("Microsoft") || v.name.includes("Google")) ||
    null;
  speech.pitch = 0.55;
  speech.rate = 0.82;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}

// Initialize
loadPlaylist();
