// Variables Declaration
const counter = document.getElementById("counter");
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const reset = document.getElementById("refresh");
const displayStatus = document.getElementById("status");
const lap = document.getElementById("lap");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapsData = [];

// Display Status Indicator
displayStatus.innerText = "";

// Start Functionality
function startCounter() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime;
    timer = setInterval(updateCounter, 10);
    isRunning = true;
  }

  stop.style.display = "block";
  play.style.display = "none";
  displayStatus.innerText = "Running";
}

play.addEventListener("click", startCounter);

// Stop Functionality
function stopCounter() {
  if (isRunning) {
    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;
  }
  play.style.display = "block";
  stop.style.display = "none";
  displayStatus.innerText = "Paused";
}

stop.addEventListener("click", stopCounter);

// Reset Functionality
function resetCounter() {
  if (isRunning || !isRunning) {
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    counter.textContent = "00:00:00:00";
    displayStatus.innerText = "";
    play.style.display = "block";
    stop.style.display = "none";
  }
}

reset.addEventListener("click", resetCounter);

// Stopwatch Formular
function updateCounter() {
  let currentTime = Date.now();
  elapsedTime = currentTime - startTime;

  let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  let seconds = Math.floor((elapsedTime / 1000) % 60);
  let milliseconds = Math.floor((elapsedTime % 1000) / 10);

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  milliseconds = String(milliseconds).padStart(2, "0");

  counter.innerText = `${hours}:${minutes}:${seconds}:${milliseconds}`;
}
