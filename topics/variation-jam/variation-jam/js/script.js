let gif;
let menuImgs = [];  
let index = 0;
//dimensions
const W = 1400;
const H = 1200;

let scaleFactor;
let bgMusic;

let startTime=0;
let elapsedTime=0;
let jerseyFont;
let activeSpeed;  
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


let btX;
let tpX;
let spX;

let activeImg;
let activeX;

//loading my images and gif
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
  jerseyFont = loadFont('assets/fonts/Jersey10-Regular.ttf');

  bgMusic = loadSound('assets/sounds/pkmn.mp3');

}

function setup() {
  scaleFactor = min(windowWidth / W, windowHeight / H);
  createCanvas(W * scaleFactor, H * scaleFactor);
  imageMode(CORNER);
  noSmooth();

  bgMusic.setVolume(0.08);  // volume (0.0 to 1.0)
  bgMusic.loop();          // plays forever

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
//drawing the menu
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

  elapsedTime = millis() - startTime;

  push();
  fill(255);
  textFont(jerseyFont);
  textSize(48);
  textAlign(RIGHT, TOP);
  text("Time Survived: " + nf(elapsedTime / 1000, 1, 2) + "s", W - 20, 20);
  pop();
  

  // Move only selected projectile
activeX -= activeSpeed;

if (activeX < -100) {
  activeX = W + 400;
  activeSpeed = random(15, 40);  // random speed each time it resets
}


  image(activeImg, activeX, 950, 110, 80);
  image(toiletshooter, 1380, 920, 150, 150);

  // Collision
  if (activeX < charX + 47 && activeX + 60 > charX) {
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

      // when you click enter on bullet option it redirects to bullet game and this is where the bullet img speed is set 
      if (index === 0) {
        activeImg = btImg;
        activeX = btX = W + 200;
      }

      // same with toilet paper option
      if (index === 1) {
        activeImg = tpImg;
        activeX = tpX = W + 200;
      }

      // and with spaghetti too
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

  if (!bgMusic.isPlaying()) {
  bgMusic.loop();
}

}

function startGame() {
  activeSpeed = random(15,52); // random speed for selected projectile
  state = "game";
  charY = 900;
  jumpHeight = 0;
  startTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
