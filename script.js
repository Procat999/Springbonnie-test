let audioElement = new Audio();
let showPlaying = false;

// Hardcode your music files here (any filenames, spaces are fine)
let playlist = [
  "Music/Hidden in the Sand.ogg",
];

let songIndex = 0;

function updateMode(text){
  document.getElementById("mode").innerText = "Current Mode: " + text;
}

// --- Idle Mode ---
function setIdle(){
  stopShow();
  stopQuestions();
  updateMode("Idle");
}

// --- Show Time ---
function startShow(){
  stopQuestions();
  showPlaying = true;
  playNextSong();
  audioElement.onended = playNextSong;
  updateMode("Show Time");
}

function playNextSong(){
  if(!showPlaying || playlist.length === 0) return;
  audioElement.src = playlist[songIndex];
  audioElement.play();
  songIndex = (songIndex + 1) % playlist.length;
}

function stopShow(){
  showPlaying = false;
  audioElement.pause();
  audioElement.src = "";
}

// --- Question Mode ---
async function startQuestions(){
  stopShow();
  updateMode("Connecting...");

  const url = "https://atoms.smallest.ai/api/v1/session";
  const body = { agent_id: "69990337bd8de6de9e7bd50c" };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": "Bearer sk_db9f3610b4902650afbe9a07950c",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const session = await resp.json();
    updateMode("Question Mode Connected");
    console.log("Spring Bonnie session:", session);
  } catch(e){
    console.error("Could not connect:", e);
    updateMode("Connection Failed");
  }
}

// --- Voice commands ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognizer = new SpeechRecognition();
recognizer.continuous = true;
recognizer.interimResults = false;
recognizer.lang="en-US";

recognizer.onresult = (event)=>{
  let last = event.results[event.results.length-1][0].transcript.toLowerCase().trim();
  console.log("Heard:", last);

  if(last.includes("spring bonnie enter stage mode")){
    speakLine("Returning to stage performance.");
    startShow();
  } else if(last.includes("spring bonnie sleep")){
    speakLine("Entering rest mode.");
    setIdle();
  }
};

recognizer.start();

function speakLine(text){
  const speech = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  speech.voice = voices.find(v=>v.name.includes("Microsoft") || v.name.includes("Google"));
  speech.pitch = 0.55;
  speech.rate = 0.82;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}
