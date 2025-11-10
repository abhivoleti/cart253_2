let choosecharacter;
let backgroundtemplate;
let gameover;
let instructionspage;
let iffrog, iffly;
let frogImg, flyImg; 
let leafgreen;
let fight, instructions, run;
let frogFrame = 0;
let flyFrame = 0;
let frameCounter = 0;
const frameDelay = 10;

const frog = {
    body: { x: 320, y: 520, size: 130 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle", hit: false }
};

let fly = { x: 0, y: 200, size: 30, speed: 3 };
let misses = 0;
const MAX_MISSES = 3;

let currentPage = 'choose';
let pageHistory = ['choose'];
let transitionTimer = 0;
const transitionDelay = 30;
let playerIsFrog = false;

function preload() {
    choosecharacter = loadImage('assets/images/choosecharacter.png');
    frogImg = loadImage('assets/images/frog/frog01.png');
    flyImg = loadImage('assets/images/fly/fly01.png');
    iffrog = loadImage('assets/images/iffrog.png');
    iffly = loadImage('assets/images/iffly.png');
    fight = loadImage('assets/images/fight.png');
    run = loadImage('assets/images/run.png');
    instructions = loadImage('assets/images/instructions.png');
    instructionspage = loadImage('assets/images/instructionspage.png');
    gameover = loadImage('assets/images/gameover.png');
    backgroundtemplate = loadImage('assets/images/backgroundtemplate.png');
    leafgreen = loadSound('assets/sounds/leafgreen.mp3');
}

function setup() {
    createCanvas(880, 540);
    resetFly();

    textFont('Pixelify Sans');
    textSize(32);
    fill(255);
    textAlign(RIGHT, TOP);

    leafgreen.setVolume(0.03);
    leafgreen.loop= true;
    
    userStartAudio().then(() => {
    leafgreen.play();
     });

    
}

function draw() {
    background("#87ceeb");

    if (currentPage === 'choose') {
        image(choosecharacter, 0, 0, width, height);
        drawFrogImage();
        drawFlyImage();
    }
    else if (currentPage === 'iffrog') {
        image(iffrog, 0, 0, width, height);
        drawfight();
        drawrun();
        drawinstructions();
    }
    else if (currentPage === 'iffly') {
        image(iffly, 0, 0, width, height);
        drawfight();
        drawrun();
        drawinstructions();
    }
    else if (currentPage === 'instructions') {
        image(instructionspage, 0, 0, width, height);
    }
    else if (currentPage === 'gameover') {
        image(gameover, 0, 0, width, height);
    }
    else if (currentPage === 'game') {
        image(backgroundtemplate, 0, 0, width, height);
        
        if (playerIsFrog) {
            moveFlyAuto();
            moveFrog();
            moveTongue();
            checkTongueFlyOverlap();
            drawTongue();
            drawFly();
            checkMisses();
        } else {
            moveFlyWithKeyboard();
            constrainFly();
            moveFrogAuto();
            autoMoveTongue();
            checkTongueFlyOverlap();
            drawTongue();
            drawFly();
        }
    }

    if (transitionTimer > 0) {
        transitionTimer--;
        if (transitionTimer === 0) {
            currentPage = pageHistory[pageHistory.length - 1];
            if (currentPage === 'game') {
                resetGame();
            }
            pageHistory = ['choose', currentPage];
        }
    }

    frameCounter++;
    if (frameCounter >= frameDelay) {
        frameCounter = 0;
    }
}

function drawFrogImage() {
    image(frogImg, 0, 0, width, height);
}

function drawFlyImage() {
    image(flyImg, 0, 0, width, height);
}

function drawfight() { image(fight, 0, 0, width, height); }
function drawrun() { image(run, 0, 0, width, height); }
function drawinstructions() { image(instructions, 0, 0, width, height); }

function drawFly() {
    fill("#ffeb3b"); noStroke(); ellipse(fly.x, fly.y, fly.size);
    fill("#ffffff"); ellipse(fly.x+6, fly.y-5, fly.size/2);
    fill("#000000"); ellipse(fly.x+10, fly.y-5, fly.size/4);
}

function moveFlyAuto() {
    fly.x += fly.speed;
    if (fly.x > width) {
        resetFly();
    }
}

function moveFlyWithKeyboard() {
    if (keyIsDown(LEFT_ARROW)) fly.x -= fly.speed;
    if (keyIsDown(RIGHT_ARROW)) fly.x += fly.speed;
    if (keyIsDown(UP_ARROW)) fly.y -= fly.speed;
    if (keyIsDown(DOWN_ARROW)) fly.y += fly.speed;
}

function constrainFly() {
    fly.x = constrain(fly.x, fly.size/2, width - fly.size/2);
    fly.y = constrain(fly.y, fly.size/2, height - fly.size/2);
}

function moveFrog() {
    frog.body.x = mouseX;
    frog.body.x = constrain(frog.body.x, frog.body.size/2, width - frog.body.size/2);
}

let dir = 1;
function moveFrogAuto() {
  frog.body.x += 5 * dir;
  if (frog.body.x >= width - frog.body.size / 2 || frog.body.x <= frog.body.size / 2) dir *= -1;
}

function autoMoveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        frog.tongue.y = frog.body.y;
    } else if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= frog.body.y) {
            frog.tongue.state = "idle";
            frog.tongue.y = frog.body.y;
        }
    }
}

function moveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= frog.body.y) {
            if (playerIsFrog && !frog.tongue.hit) { 
                misses++; 
                checkMisses(); 
            }
            frog.tongue.hit = false;
            frog.tongue.state = "idle";
            frog.tongue.y = frog.body.y;
        }
    }
}

function drawTongue() {
    // Tongue
    fill("#ff0000"); noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    stroke("#ff0000"); strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    
    // Frog body and eyes
    noStroke();
    fill("#3ca270");
    ellipse(frog.body.x, frog.body.y, frog.body.size);

    fill("#ede075");
    ellipse(frog.body.x - 35, frog.body.y - 55, frog.body.size / 4);
    ellipse(frog.body.x + 35, frog.body.y - 55, frog.body.size / 4);

    fill("#000000");
    ellipse(frog.body.x - 35, frog.body.y - 55, frog.body.size / 6);
    ellipse(frog.body.x + 35, frog.body.y - 55, frog.body.size / 6);
}

function checkTongueFlyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    if (d < frog.tongue.size / 2 + fly.size / 2) {
        frog.tongue.hit = true;
        if (playerIsFrog) {
            resetFly();
            frog.tongue.state = "inbound";
        } else {
            goToGameOver();
        }
    }
}

function checkMisses() {
    if (playerIsFrog && misses >= MAX_MISSES) goToGameOver();

    if (playerIsFrog) {
    fill(255);
    noStroke();
    textAlign(RIGHT, TOP);
    textSize(32);
    text(`strike ${misses}`, width - 20, 20);
}

}

function goToGameOver() {
    currentPage = 'gameover';
    transitionTimer = transitionDelay;
    pageHistory.push('gameover');
}

function resetFly() {
    fly.x = 0;
    fly.y = random(50, 300);
}

function resetGame() {
    frog.tongue.state = "idle";
    frog.tongue.y = frog.body.y;
    frog.tongue.hit = false;
    misses = 0;
    resetFly();
}

function isClickInImage(img) {
    let w = img.width;
    let h = img.height;
    let scaledX = floor(map(mouseX, 0, width, 0, w));
    let scaledY = floor(map(mouseY, 0, height, 0, h));
    if (scaledX >= 0 && scaledX < w && scaledY >= 0 && scaledY < h) {
        return img.get(scaledX, scaledY)[3] > 0;
    }
    return false;
}

function mousePressed() {
    if (transitionTimer > 0) return;

    if (currentPage === 'choose') {
        if (isClickInImage(frogImg)) {
            playerIsFrog = true;
            transitionTimer = transitionDelay;
            pageHistory = ['choose', 'iffrog'];
        }
        else if (isClickInImage(flyImg)) {
            playerIsFrog = false;
            transitionTimer = transitionDelay;
            pageHistory = ['choose', 'iffly'];
        }
    }
    else if (currentPage === 'iffrog' || currentPage === 'iffly') {
        if (isClickInImage(fight)) {
            transitionTimer = transitionDelay;
            pageHistory = ['choose', currentPage, 'game'];
        }
        else if (isClickInImage(instructions)) {
            transitionTimer = transitionDelay;
            pageHistory = ['choose', currentPage, 'instructions'];
        }
        else if (isClickInImage(run)) {
            transitionTimer = transitionDelay;
            pageHistory = ['choose', currentPage, 'gameover'];
        }
    }
    else if (currentPage === 'game' && playerIsFrog) {
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
            frog.tongue.y = frog.body.y;
            frog.tongue.hit = false;
        }
    }
}

function keyPressed() {
    if (transitionTimer > 0) return;
    if (key === ' ') {
        transitionTimer = transitionDelay;
        pageHistory = ['choose'];
    }
}
