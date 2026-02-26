let gif;
let menuImgs = [];
let prescreens = [];
let index = 0;
// sprite images
let oneSprite;
let characterSprites = [];

//dimensions
const W = 1400;
const H = 1200;

let scaleFactor;
let bgMusic;

let startTime = 0;
let elapsedTime = 0;
let jerseyFont;
let activeSpeed;
let state = "pre-selection";
// let state = "menu";

// GAME ASSETS
let groundImg, c1, c2, c3;
let btImg, tpImg, spImg;
let toiletshooter;
let gameoverImg;

// char properties
let charX = 120;
let charY = 100;
let charH = 500;
let charW = 500;
let jumpHeight = 0;
let jumping = false;

let preindex = 0;
let btX;
let tpX;
let spX;

let activeImg;
let activeX;

let throwimg;
let throwsprite;

let bulletDirection = "left";
let playerlocationX = 120;
//loading my images and gif
function preload() {
  oneSprite = loadImage("assets/images/1sprite.png");
  twoSprite = loadImage("assets/images/5sprite.png");
  threeSprite = loadImage("assets/images/4sprite.png");
  gif = loadImage("assets/images/firstpage.jpg");

  //images after you click down/up arrow
  menuImgs[0] = loadImage("assets/images/bullets.png");
  menuImgs[1] = loadImage("assets/images/grenades.png");
  menuImgs[2] = loadImage("assets/images/spaghetti.png");

  prescreens[0] = loadImage("assets/images/one.jpg");
  prescreens[1] = loadImage("assets/images/two.jpg");
  prescreens[2] = loadImage("assets/images/three.jpg");

  groundImg = loadImage("assets/images/ground.png");
  c1 = loadImage("assets/images/char1.png"); //didnt use might use
  c2 = loadImage("assets/images/char.gif"); //main character gif
  c3 = loadImage("assets/images/char3.png"); //didnt use might use

  btImg = loadImage("assets/images/bt.png"); //imgbullets
  tpImg = loadImage("assets/images/tp.png"); //imgtoiletpaper
  spImg = loadImage("assets/images/sp1.png"); //imgspaghetti

  throwimg = loadImage("assets/images/chef1.png"); //imgspaghetti

  gameoverImg = loadImage("assets/images/gameover.png");

  toiletshooter = loadImage("assets/images/tps.png");
  jerseyFont = loadFont("assets/fonts/Jersey10-Regular.ttf");

  bgMusic = loadSound("assets/sounds/pkmn.mp3");
}

function setup() {
  scaleFactor = min(windowWidth / W, windowHeight / H);
  createCanvas(W * scaleFactor, H * scaleFactor);
  imageMode(CORNER);
  noSmooth();

  bgMusic.setVolume(0.08); // volume (0.0 to 1.0)
  bgMusic.loop();

  // plays forever
  characterSprites[0] = new Sprite(oneSprite, 490, 250, 5, 712);
  characterSprites[1] = new Sprite(twoSprite, 490, 250, 5, 712);
  characterSprites[2] = new Sprite(threeSprite, 490, 250, 5, 712);

  throwsprite = new SpriteSpaghetti(throwimg, 1248, 900, 5, 712);
}

function draw() {
  background(0);

  if (state === "pre-selection") drawPreSelection();
  else {
    if (state === "menu") drawMenu();
    else if (state === "game") drawGame();
    else if (state === "gameover") drawGameOver();
  }
}
//drawing the menu

function drawPreSelection() {
  image(prescreens[preindex], 0, 0, width, height);
}
function drawMenu() {
  push();
  scale(width / W, height / H);
  image(gif, 0, 0, W, H);
  image(menuImgs[index], 0, 0, W, H); // menu icon ONLY

  console.log(preindex);

  pop();
  characterSprites[preindex].draw();
}

let groundX = 0;

function drawGame() {
  push();
  scale(width / W, height / H);
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
  //image(c2, charX, charY, charW, charH);

  //characterSprites[preindex].y = charY

 
  characterSprites[preindex].H = charH;
  characterSprites[preindex].W = charW;
  characterSprites[preindex].y = charY;
  if (index === 0) {
    characterSprites[preindex].x = playerlocationX;
    if(bulletDirection==="left"){

     characterSprites[preindex].draw();

    }
    else{
      characterSprites[preindex].drawFlip();
    }

  } 
  else {
    characterSprites[preindex].x = charX;
     characterSprites[preindex].draw();
  }

  elapsedTime = millis() - startTime;

  push();
  fill(255);
  textFont(jerseyFont);
  textSize(48);
  textAlign(RIGHT, TOP);
  text("Time Survived: " + nf(elapsedTime / 1000, 1, 2) + "s", W - 20, 20);
  pop();

  if (index !== 2) {
    // Move only selected projectile
    activeX -= activeSpeed;
  }

  //is 2
  else {
    if (throwsprite.isThrowing === false) {
      activeX -= activeSpeed;
    }
  }

  if (index === 0) {
    if (bulletDirection === "left") {
      if (activeX < -100) {
        activeX = W + 400;
        activeSpeed = random(15, 40); // random speed each time it resets
      }
    }

    if (bulletDirection === "right") {
      console.log("right")
      console.log(activeX)
      if (activeX > W + 100) {
        console.log("reset");
        activeX = -20;
        activeSpeed = random(-40, -15); // random speed each time it resets
      }
    }
  }

  //reset spaghetti animation
  else if (index === 2) {
    if (activeX < -100) {
      activeX = W + 400;
      activeSpeed = random(15, 40); // random speed each time it resets

      throwsprite.isThrowing = true;
      throwsprite.frame = 0;
    }
  } else {
    if (activeX < -100) {
      activeX = W + 400;
      activeSpeed = random(15, 40); // random speed each time it resets
    }
  }

  if (index == 2) {
    if (throwsprite.isThrowing === true) {
      throwsprite.draw(activeSpeed);
    } else {
      console.log(activeX);
      image(activeImg, activeX, 950, 110, 80);
    }
  } //spaghetti index
  
  else if (index === 0) {
    if (bulletDirection === "left") {
        image(activeImg, activeX, 950, 110, 80);
    }
    else{
      push();
      translate(activeX,950);
      scale(-1,1);
      image(activeImg, 0, 0, 110, 80);
      pop();

    }

    
  } else {
    image(activeImg, activeX, 950, 110, 80);
  }

  //image(toiletshooter, 1380, 920, 150, 150);

  // Collision
  if(index!==0){
  if (activeX < charX && activeX + 60 > charX) {
    if (charY > 800) {
      console.log("hit");
      state = "gameover";
    }
  }
}
 else{
  
  if(bulletDirection==="left"){
    if (activeX < playerlocationX && activeX + 60 > playerlocationX) {
    if (charY > 800) {
      console.log("hit");
      state = "gameover";
    }
  }

  }
  else{
    if (activeX+60 > playerlocationX && activeX<playerlocationX+60)  {
    if (charY > 800) {
      console.log("hit");
      state = "gameover";
    }
  }

  }
 }
  pop();
}

function drawGameOver() {
  background(0);
  push();
  scale(width / W, height / H);
  image(gameoverImg, 0, 0, W, H);
  pop();
}

function keyPressed() {
  // ESC → return home
  if (keyCode === ESCAPE) {
    state = "pre-selection";
    return;
  }
  if (state === "pre-selection") {
    if (keyCode === RIGHT_ARROW) preindex = (preindex + 1) % 3;
    if (keyCode === LEFT_ARROW) preindex = (preindex - 1 + 3) % 3;
    if (keyCode === ENTER) {
      state = "menu";
    }
  } else if (state === "menu") {
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
    if (key === " ") {
      if (!jumping && charY >= 900) jumping = true;
    }
    if (index === 0) {
      if (keyCode === LEFT_ARROW) {
        bulletDirection = "right";
        activeX = btX = -20;
        playerlocationX = 950;
         activeSpeed = random(-40, -15); // random speed each time it resets
      }
      if (keyCode === RIGHT_ARROW) {
        bulletDirection = "left";
        activeX = btX = W + 200;
        playerlocationX = 120;
        activeSpeed = random(15, 40); // random speed each time it resets
      }
    }
  }

  if (state === "gameover") {
    if (key === "r") state = "menu";
  }

  if (!bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

function startGame() {
  activeSpeed = random(15, 52); // random speed for selected projectile
  state = "game";
  charY = 900;
  jumpHeight = 0;
  startTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
