/**
 * Lines
 * Abhinav Voleti
 * 
 * A series of lines across the canvas
 */

"use strict";

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(500, 500);
    colorMode(HSB);
}

function draw() {
    background("pink");

    let x = 0;
    let x2 = width;
    let y = 0;
    let a = 0;
    let verticalWeight = 1;
    let horizontalWeight = 1;

    for (let x = 0; x <= width; x++) {
        let bgVar = map(x, 0, width, 0, 1);
        stroke(lerpColor(color(366, 67, 96), color(81, 96, 93), bgVar));
        line(x, 0, x, height);
    }

    while (x <= width) {
        strokeWeight(verticalWeight);
        let verticalVar = map(sin(a), -1, 1, 1, 0)
        stroke(lerpColor(color(300, 60, 91), color(81, 90, 93), verticalVar));
        line(x, 0, x, height);

        verticalWeight += 3;
        x += 50;
        a += 0.05;
    }

    while (x2 >= 0) {
        strokeWeight(horizontalWeight);
        let horizontalVar = map(sin(a), -1, 1, 1, 0);
        stroke(lerpColor(color(300, 67, 96), color(81, 96, 93), horizontalVar));
        line(0, 0, x2, y);

        horizontalWeight += 0.5;
        x2 -= 50;
        y += 50;
        a += 0.05;
    }
}

// stroke(0);
//     line(0, 0, 0, height);
    
//     stroke(25);
//     line(50, 0, 50, height);
    
//     stroke(50);
//     line(100, 0, 100, height);
    
//     stroke(75);
//     line(150, 0, 150, height);
    
//     stroke(100);
//     line(200, 0, 200, height);
    
//     stroke(125);
//     line(250, 0, 250, height);
    
//     stroke(150);
//     line(300, 0, 300, height);
    
//     stroke(175);
//     line(350, 0, 350, height);
    
//     stroke(200);
//     line(400, 0, 400, height);
    
//     stroke(225);
//     line(450, 0, 450, height);
    
//     stroke(250);
//     line(500, 0, 500, height);
// 