/**
 * Rome ravioli
 * Abhinav Voleti
 *
 * A ball that bounces around on the canvas
 */

let balls = []; // array to hold all the balls

function setup() {
  createCanvas(400, 400);

  // Create 5 random balls
  for (let i = 0; i < 5; i++) {
    balls.push(createBall());
  }
}

/**
 * Creates a random ball
 */
function createBall(x = random(width), y = random(height)) {
  const newBall = {
    x: x,
    y: y,
    size: random(10, 50),
    fill: color(random(255), random(255), random(255)),
    velocity: {
      x: random(-5, 5),
      y: random(-5, 5)
    }
  };
  return newBall;
}

/**
 * Draw loop
 */
function draw() {
  background("#87ceeb");

  // Loop through every ball in the array
  for (let ball of balls) {
    moveBall(ball);
    bounceBall(ball);
    drawBall(ball);
  }
}

/**
 * Add a ball wherever you click
 */
function mousePressed() {
  let vx = (mouseX - pmouseX) / 2;
  let vy = (mouseY - pmouseY) / 2;

  let newBall = createBall(mouseX, mouseY);
  newBall.velocity.x = vx;
  newBall.velocity.y = vy;

  balls.push(newBall);
}

/**
 * Moves the ball according to its velocity
 */
function moveBall(ball) {
  ball.x += ball.velocity.x;
  ball.y += ball.velocity.y;
}

/**
 * Bounces the ball off the walls
 */
function bounceBall(ball) {
  if (ball.x > width || ball.x < 0) {
    ball.velocity.x *= -1;
  }
  if (ball.y > height || ball.y < 0) {
    ball.velocity.y *= -1;
  }
}

/**
 * Draw the ball on the canvas
 */
function drawBall(ball) {
  push();
  noStroke();
  fill(ball.fill);
  ellipse(ball.x, ball.y, ball.size);
  pop();
}
