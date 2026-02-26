/**
 * Creates a sprite class sheet used for all sprite animations
 */
class Sprite {
  constructor(sheet, x, y, numberFrames, sheetWidth) {
    this.sheet = sheet;
    this.x = x;
    this.y = y;
    this.h = 111;
    this.frame = 0;
    this.scale = 1;
    this.frames = numberFrames;
    this.sheetWidth = sheetWidth;
    this.frameWidth = this.sheetWidth / this.frames;

    // Default  state
    this.controllable = false;
    // default "Speed" if controllable
    this.speed = 10;
  }

  // Allows for speeder movement when .controllable = true
  update() {
    if (this.controllable) {
      if (keyIsDown(87)) this.y -= this.speed; // W
      if (keyIsDown(83)) this.y += this.speed; // S
      if (keyIsDown(65)) this.x -= this.speed; // A
      if (keyIsDown(68)) this.x += this.speed; // D
    }

    // Sprite width and height variables
    let spriteW = this.frameWidth * this.scale;
    let spriteH = this.h * this.scale;

    // Constrains sprite to canvas
    //   this.x = constrain(this.x, 0, width - spriteW);
    //   this.y = constrain(this.y, 0, height - spriteH);
  }

  draw() {
    this.update();
    image(
      this.sheet,
      this.x,
      this.y,
      this.frameWidth * this.scale,
      this.h * this.scale,
      this.frameWidth * floor(this.frame),
      0,
      this.frameWidth,
      this.h
    );
    this.frame += 0.1;
    if (this.frame >= this.frames) {
      this.frame = 0;
    }
  }

  drawFlip() {
    this.update();
    push();
    translate(this.x, this.y);
    scale(-1, 1);
    image(
      this.sheet,
      0,
      0,
      this.frameWidth * this.scale,
      this.h * this.scale,
      this.frameWidth * floor(this.frame),
      0,
      this.frameWidth,
      this.h
    );
    pop();
    this.frame += 0.1;
    if (this.frame >= this.frames) {
      this.frame = 0;
    }
  }
}
