/*
 * LoLtris
 */
"use strict";
let canvas;
let context;

// Main stuff
let fps;
let timePassed = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;

let movingSpeed = 50;
let rectX = 0;
let rectY = 0;

window.onload = init;

function init(){
    canvas = document.getElementById('gamefield');
    context = canvas.getContext('2d');
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    //secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    /*
    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    // Draw number to the screen
    context.fillStyle = 'white';
    context.fillRect(0, 0, 200, 200);
    context.font = '16px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, 10, 30);
    */

    update(secondsPassed);
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    timePassed += secondsPassed

    // Use different easing functions for different effects.
    rectX = easeInOutQuint(timePassed, 50, 500, 1.5);
    rectY = easeLinear(timePassed, 50, 250, 1.5);
}


// Example easing functions
function easeInOutQuint (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

function easeLinear (t, b, c, d) {
    return c * t / d + b;
}

function draw(){
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Fill with red
    context.fillStyle = '#ff8080';
    // Draw a rectangle on the canvas
    context.fillRect(rectX, rectY, 150, 100);
}