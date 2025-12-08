let gif;
let menuImgs = [];  
let index = 0;
//dimensions
const W = 1400;
const H = 1200;

let scaleFactor;


let state = "menu";

// GAME ASSETS
let groundImg, c1, c2, c3;
let btImg, tpImg, spImg;
let toiletshooter;
let gameoverImg;

// char properties 
let charX = 200;
let charY = 900;
let jumpHeight = 0;
let jumping = false;

// PROJECTILE POSITIONS
let btX;
let tpX;
let spX;

// ACTIVE PROJECTILE + ACTIVE X
let activeImg;
let activeX;

function preload() {
  gif = loadImage('assets/images/kaj.gif');

  //images after you click down/up arrow
  menuImgs[0] = loadImage('assets/images/bullets.png'); 
  menuImgs[1] = loadImage('assets/images/grenades.png');
  menuImgs[2] = loadImage('assets/images/spaghetti.png');


  groundImg = loadImage('assets/images/ground.png');
  c1 = loadImage('assets/images/char1.png'); //didnt use might use
  c2 = loadImage('assets/images/char.gif');  //main character gif 
  c3 = loadImage('assets/images/char3.png'); //didnt use might use

  btImg = loadImage('assets/images/bt.png');   //imgbullets
  tpImg = loadImage('assets/images/tp.png');   //imgtoiletpaper
  spImg = loadImage('assets/images/sp.png');  //imgspaghetti

  gameoverImg = loadImage('assets/images/gameover.png');

  toiletshooter = loadImage('assets/images/tps.png');
}

function setup() {
  scaleFactor = min(windowWidth / W, windowHeight / H);
  createCanvas(W * scaleFactor, H * scaleFactor);
  imageMode(CORNER);
  noSmooth();
}

function draw() {
  background(0);
  push();
  scale(width / W, height / H);

  if (state === "menu") drawMenu();
  else if (state === "game") drawGame();
  else if (state === "gameover") drawGameOver();

  pop();
}

function drawMenu() {
  image(gif, 0, 0, W, H);
  image(menuImgs[index], 0, 0, W, H);  // menu icon ONLY
}

let groundX = 0;

function drawGame() {
  background(0);

  groundX -= 10;
  if (groundX <= -groundImg.width) groundX = 0;

  image(groundImg, groundX, H - groundImg.height);
  image(groundImg, groundX + groundImg.width, H - groundImg.height);

  if (jumping) {
    jumpHeight += 20;
    charY = 900 - jumpHeight;
    if (jumpHeight >= 250) jumping = false;
  } else {
    if (charY < 900) {
      jumpHeight -= 20;
      charY = 900 - jumpHeight;
    }
  }

  let charW = c1.width / 9;
  let charH = c1.height / 9;
  image(c2, charX, charY, charW, charH);

  // Move only selected projectile
  activeX -= 29;
  if (activeX < -100) activeX = W + 400;

  image(activeImg, activeX, 950, 110, 80);
  image(toiletshooter, 1380, 920, 150, 150);

  // Collision
  if (activeX < charX + 50 && activeX + 120 > charX) {
    if (charY > 800) state = "gameover";
  }
}

function drawGameOver() {
  background(0);
  image(gameoverImg, 0, 0, W, H);
}

function keyPressed() {

  // ESC → return home
  if (keyCode === ESCAPE) {
    state = "menu";
    return;
  }

  if (state === "menu") {
    if (keyCode === DOWN_ARROW) index = (index + 1) % 3;
    if (keyCode === UP_ARROW) index = (index - 1 + 3) % 3;

    if (keyCode === ENTER) {

      // BULLETS
      if (index === 0) {
        activeImg = btImg;
        activeX = btX = W + 200;
      }

      // TOILET PAPER
      if (index === 1) {
        activeImg = tpImg;
        activeImg = toiletshooter;
        activeX = tpX = W + 200;
      }

      // SPAGHETTI
      if (index === 2) {
        activeImg = spImg;
        activeX = spX = W + 200;
      }

      startGame();
    }
  }

  if (state === "game") {
    if (key === ' ') {
      if (!jumping && charY >= 900) jumping = true;
    }
  }

  if (state === "gameover") {
    if (key === 'r') state = "menu";
  }
}

function startGame() {
  state = "game";
  charY = 900;
  jumpHeight = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
