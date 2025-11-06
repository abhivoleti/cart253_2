let choosecharacter;
let backgroundtemplate;
let gameover;
let instructionspage;
let iffrog, iffly;
let frogImg, flyImg; 
let fight, instructions, run;
let frogFrame = 0;
let flyFrame = 0;
let frameCounter = 0;
const frameDelay = 10;

const frog = {
    body: { x: 320, y: 520, size: 130 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" }
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
}

function setup() {
    createCanvas(880, 540);
    resetFly();
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
            drawFrogPlayer();
            drawFly();
            checkMisses();
        } else {
            moveFlyWithKeyboard();
            constrainFly();
            moveFrogAuto();
            autoMoveTongue();
            checkTongueFlyOverlap();
            drawTongue();
            drawFrogPlayer();
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
    push();
    image(frogImg, 0, 0, width, height);
    pop();
}

function drawFlyImage() {
    push();
    image(flyImg, 0, 0, width, height);
    pop();
}

function drawiffrog() {
    push();
    image(iffrog, 0, 0, width, height);
    pop();
}

function drawiffly() {
    push();
    image(iffly, 0, 0, width, height);
    pop();
}

function drawfight() {
    push();
    image(fight, 0, 0, width, height);
    pop();
}

function drawrun() {
    push();
    image(run, 0, 0, width, height);
    pop();
}

function drawinstructions() {
    push();
    image(instructions, 0, 0, width, height);
    pop();
}

function drawFrogPlayer() {
    push();
    image(frogImg, frog.body.x - frog.body.size/2, frog.body.y - frog.body.size/2, frog.body.size, frog.body.size);
    pop();
}

function drawFly() {
    push();
    fill("#ffeb3b");
    noStroke();
    ellipse(fly.x, fly.y, fly.size);
    pop();

    fill("#ffffff");
    noStroke();
    ellipse(fly.x+6, fly.y-5, fly.size/2);
    pop();

    fill("#000000");
    noStroke();
    ellipse(fly.x+10, fly.y-5, fly.size/4);
    pop();
}

function moveFlyAuto() {
    fly.x += fly.speed;
    if (fly.x > width) {
        misses++;
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
  frog.body.x += 4 * dir;

  if (frog.body.x >= width - frog.body.size / 2 || frog.body.x <= frog.body.size / 2) {
    dir *= -1;
  }
}

function autoMoveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        frog.tongue.y = frog.body.y;
    } else if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
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
    if (frog.tongue.state === "idle") {
    } else if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= frog.body.y) {
            frog.tongue.state = "idle";
            frog.tongue.y = frog.body.y;
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

    push();
    fill("#3ca270");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    push();
    fill("#ede075");
    noStroke();
    ellipse(frog.body.x - 35, frog.body.y - 55, frog.body.size / 4);
    pop();

    push();
    fill("#ede075");
    noStroke();
    ellipse(frog.body.x + 35, frog.body.y - 55, frog.body.size / 4);
    pop();

    push();
    fill("#000000");
    noStroke();
    ellipse(frog.body.x - 35, frog.body.y - 55, frog.body.size / 6);
    pop();

    push();
    fill("#000000");
    noStroke();
    ellipse(frog.body.x + 35, frog.body.y - 55, frog.body.size / 6);
    pop();
}

function checkTongueFlyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        if (playerIsFrog) {
            resetFly();
            frog.tongue.state = "inbound";
        } else {
            goToGameOver();
        }
    }
}

function checkMisses() {
    if (misses >= MAX_MISSES) {
        goToGameOver();
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