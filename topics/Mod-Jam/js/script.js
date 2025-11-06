let choosecharacter;
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
    body: { x: 320, y: 520, size: 150 },
    tongue: { x: undefined, y: 480, size: 20, speed: 20, state: "idle" }
};

const fly = { x: 0, y: 200, size: 10, speed: 3 };

let currentPage = 'choose';
let pageHistory = ['choose'];
let transitionTimer = 0;
const transitionDelay = 30;
const clickMargin = 30;

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
        image(choosecharacter, 0, 0, width, height);
        moveFly();
        moveFrog();
        moveTongue();
        checkTongueFlyOverlap();
        drawTongue();
        drawFrogImage();
        drawFlyImage();
    }

    if (transitionTimer > 0) {
        transitionTimer--;
        if (transitionTimer === 0) {
            currentPage = pageHistory[pageHistory.length - 1];
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

function isClickInImage(img) {
    let x = mouseX;
    let y = mouseY;
    let w = img.width;
    let h = img.height;
    let scaledX = floor(map(x, 0, width, 0, w));
    let scaledY = floor(map(y, 0, height, 0, h));
    if (scaledX >= 0 && scaledX < w && scaledY >= 0 && scaledY < h) {
        let alpha = img.get(scaledX, scaledY)[3];
        return alpha > 0;
    }
    return false;
}

function mousePressed() {
    if (transitionTimer > 0) return;

    if (currentPage === 'choose') {
        if (isClickInImage(frogImg)) {
            transitionTimer = transitionDelay;
            pageHistory = ['choose', 'iffrog'];
        }
        else if (isClickInImage(flyImg)) {
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
    else if (currentPage === 'game') {
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }
    }
}

function keyPressed() {
    if (transitionTimer > 0) return;

    if (key === ' ') {
        transitionTimer = transitionDelay;
        pageHistory = ['choose'];
    }
    else if (currentPage === 'instructions' && (key === 'a' || key === 'b')) {
        transitionTimer = transitionDelay;
        pageHistory = ['choose', pageHistory[1]];
    }
}