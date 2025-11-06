/**
 * frogs in the trap sing taj mahal
 * Abhinav Voleti
 * Choose screen + animated frog & fly
 */
"use strict";

// === STATE ===
let gamestate = "choose";  // "choose" or "play"

// === IMAGES ===
let bgChoose;
let frogFrames = [];
let flyFrames = [];

// === ANIMATION TIMING ===
let frogFrame = 0;
let flyFrame = 0;
let frameTimer = 0;
const FRAME_RATE = 8;  // frames per second for animation

// === GAME OBJECTS ===
const frog = {
  body: { x: 320, y: 520, size: 150 },
  tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" }
};
const fly = { x: 0, y: 200, size: 10, speed: 3 };

/* ----------------- PRELOAD ----------------- */
function preload() {
  // Background
  bgChoose = loadImage("assets/images/choosecharacter.png");

  // Load frog frames (5)
  for (let i = 1; i <= 5; i++) {
    frogFrames.push(loadImage(`assets/images/frog/frog0${i}.png`));
  }

  // Load fly frames (2)
  flyFrames.push(loadImage("assets/images/fly/fly01.png"));
  flyFrames.push(loadImage("assets/images/fly/fly02.png"));
}

/* ----------------- SETUP ----------------- */
function setup() {
  createCanvas(940, 520);
  resetFly();
  frameRate(60);  // smooth game
}

/* ----------------- DRAW ----------------- */
function draw() {
  if (gamestate === "choose") {
    image(bgChoose, 0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("CLICK TO START", width / 2, height - 80);
  } 
  else if (gamestate === "play") {
    background("#87ceeb");

    // Update animation timer
    frameTimer++;
    if (frameTimer >= 60 / FRAME_RATE) {
      frogFrame = (frogFrame + 1) % frogFrames.length;
      flyFrame = (flyFrame + 1) % flyFrames.length;
      frameTimer = 0;
    }

    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
  }
}

/* ----------------- INPUT ----------------- */
function mousePressed() {
  if (gamestate === "choose") {
    gamestate = "play";
  } else if (gamestate === "play" && frog.tongue.state === "idle") {
    frog.tongue.state = "outbound";
    frog.tongue.y = frog.body.y - 50;
  }
}

/* ----------------- GAME LOGIC ----------------- */
function resetFly() {
  fly.x = 0;
  fly.y = random(50, 300);
}

function moveFly() {
  fly.x += fly.speed;
  if (fly.x > width) resetFly();
}

function drawFly() {
  image(flyFrames[flyFrame], fly.x - 15, fly.y - 15, 30, 30);  // centered
}

function moveFrog() {
  frog.body.x = mouseX;
}

function moveTongue() {
  frog.tongue.x = frog.body.x;
  if (frog.tongue.state === "idle") {
    frog.tongue.y = frog.body.y - 50;
  } else if (frog.tongue.state === "outbound") {
    frog.tongue.y -= frog.tongue.speed;
    if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
  } else if (frog.tongue.state === "inbound") {
    frog.tongue.y += frog.tongue.speed;
    if (frog.tongue.y >= frog.body.y - 50) frog.tongue.state = "idle";
  }
}

function drawFrog() {
  // Draw animated frog
  image(frogFrames[frogFrame], frog.body.x - 75, frog.body.y - 100, 150, 150);

  // Tongue
  if (frog.tongue.state !== "idle") {
    stroke("#ff0000");
    strokeWeight(8);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y - 50);
    fill("#ff69b4");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, 20);
  }
}

function checkTongueFlyOverlap() {
  const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  if (d < 25) {
    resetFly();
    frog.tongue.state = "inbound";
  }
}