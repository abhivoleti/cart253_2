let choosecharacter;
let frogImg, flyImg;  // Single images

let frogFrame = 0;
let flyFrame = 0;
let frameCounter = 0;
const frameDelay = 10;

const frog = {
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" }
};

const fly = { x: 0, y: 200, size: 10, speed: 3 };

function preload() {
    choosecharacter = loadImage('assets/images/choosecharacter.png');
    
    // Load only frog01.png
    frogImg = loadImage('assets/images/frog/frog01.png');
    
    // Load only fly01.png
    flyImg = loadImage('assets/images/fly/fly01.png');
}

function setup() {
    createCanvas(880, 540);
    resetFly();
}

function draw() {
    background("#87ceeb");
    image(choosecharacter, 0, 0, width, height);

    moveFly();
    moveFrog();
    moveTongue();
    checkTongueFlyOverlap();

    // Draw tongue
    drawTongue();

    // Draw single images
    drawFrogImage();
    drawFlyImage();

    // (Keep your frame counter — harmless)
    frameCounter++;
    if (frameCounter >= frameDelay) {
        frameCounter = 0;
    }
}

function drawFrogImage() {
    push();
    image(frogImg, 0, 0, width, height);
    pop();
}

function drawFlyImage() {
    push();
    image(flyImg, 0, 0, width, height);
    pop();
}

function moveFly() {
    fly.x += fly.speed;
    if (fly.x > width) {
        resetFly();
    }
}

function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

function moveFrog() {
    frog.body.x = mouseX;
}

function moveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") {
        // Do nothing
    } else if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

function drawTongue() {
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();
}

function checkTongueFlyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        resetFly();
        frog.tongue.state = "inbound";
    }
}

function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}