/*
 * LoLtris
 * 
 * This lovely gameloop engine was copied from:
 * https://spicyyoghurt.com/tutorials/html5-javascript-game-development/images-and-sprite-animations
 * thanks Spicy Yoghurt!
 * everything else is selfmade, more or less
 * 
 */

"use strict";
let canvas;
let context;

// globals 😬
let fps = 0;
let timePassed = 0;
let secondsPassed = 0;
let oldTimeStamp = 0;
let scrollSpeed = 0;

let movingSpeed = 50;
let rectX = 80;
let rectY = 0;
let currentKey = 36;

// temp
let spawnNewBlock = true;

// blocks
let currentBlock = null;
let BLOCKSPECIAL = 4;
let BLOCKFILLED = 1;
let BLOCKEMPTY = 0;
let BLOCKSCALE = 20;

// gamefield
let COLUMNS = 10;
let ROWS = 20;
// fill the game field, this could be 
let GAMEFIELD = new Array(ROWS);
for (let i = 0; i < GAMEFIELD.length; i++) {
    GAMEFIELD[i] = new Array(COLUMNS);
    // use fill instead of for
    // GAMEFIELD[i] = new Array(COLUMNS).fill(0);
}
for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
        GAMEFIELD[r][c] = BLOCKEMPTY;
    }
}

console.table(GAMEFIELD);

window.onload = init;

function init(){
    canvas = document.getElementById('gamefield');
    context = canvas.getContext('2d');
    context.scale(1,1);

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp){
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    //secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;

    if (spawnNewBlock) {
        currentBlock = new Tetromino(randomBlock());

        console.table(currentBlock.piece);
        spawnNewBlock = false;
    }

    updateGameLogic(secondsPassed, timeStamp);
    draw();
    //collisionDetection();
    drawFPS(secondsPassed);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function updateGameLogic(secondsPassed, ts) {
    timePassed += secondsPassed;

    // catch the key presses here
    // thanks for Mozilla MDN Web Docs for the example!
    window.addEventListener("keydown", function (event) {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
    
        let pressedKey = event.key;
    
        switch (pressedKey) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                currentKey = pressedKey;
            break;
    
            case "Up":
            case "ArrowUp":
                currentKey = pressedKey;
            break;
            
            case "Left":
            case "ArrowLeft":
                currentKey = pressedKey;
                rectX -= BLOCKSCALE;
            break;
    
            case "Right":
            case "ArrowRight":
                currentKey = pressedKey;
                rectX += BLOCKSCALE;
            break;
            
            case "Enter":
            break;
    
            case "Esc":
            case "Escape":
            break;
            
            default:
            return; // Quit when this doesn't handle the key event.
        }
      
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }, true);

    // after rotation check the hit boxes

    // update the scrolling every 500 ms
    if ( (ts - scrollSpeed) >= 500 ) {
        if ((rectX + BLOCKSCALE) > canvas.width) {
            console.log("meni yli!");
        }
        rectY += BLOCKSCALE;
        scrollSpeed = ts;
    }
}

function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Fill with red
    context.fillStyle = '#ff8080';
    // Draw a rectangle on the canvas
    context.fillRect(rectX, rectY, BLOCKSCALE, BLOCKSCALE);
}

function drawFPS(t) {
    fps = Math.round(1 / t);

    context.font = '16px Arial';
    context.fillStyle = 'black';
    context.fillText("FPS: " + fps, 10, 30);
    context.fillText(currentKey, 10, 50);
}

function randomBlock() {
    return Math.floor(Math.random() * 7) + 1;
}

class Tetromino {

    constructor (block) {
        switch (block) {
            case 1:
                this.OrangeRicky();
            break;

            case 2:
                this.BlueRicky();
            break;

            case 3:
                this.ClevelandZ();
            break;

            case 4:
                this.RhodeIslandZ();
            break;

            case 5:
                this.Hero();
            break;

            case 6:
                this.Teewee();
            break;

            case 7:
                this.Smashboy();
            break;

            default:
            return;
        }
    }
    name = "";
    color = 'black';
    // default to 3, the special pieces are Hero and Smashboy
    size = 3;
    // current block position on field
    x = 0;
    y = 0;
    // default to 4x4 because we have a piece that's 4 blocks long.
    // otherwise we only rotate the pieces from indexes 0 to 2
    piece = [[0, 0, 0, 0,],
             [0, 0, 0, 0,],
             [0, 0, 0, 0,],
             [0, 0, 0, 0,]];

    OrangeRicky() {
        this.name = "Orange Ricky";
        this.color = 'orange';
        this.piece = [[0, 0, 1, 0,],
                      [1, 1, 1, 0,],
                      [0, 0, 0, 0,],
                      [0, 0, 0, 0,]];
    }
    BlueRicky() {
        this.name = "Blue Ricky";
        this.color = 'blue';
        this.piece = [[1, 0, 0, 0,],
                      [1, 1, 1, 0,],
                      [0, 0, 0, 0,],
                      [0, 0, 0, 0,]];
    }
    ClevelandZ() {
        this.name = "Cleveland Z";
        this.color = 'red';
        this.piece = [[1, 1, 0, 0,],
                      [0, 1, 1, 0,],
                      [0, 0, 0, 0,],
                      [0, 0, 0, 0,]];
    }
    RhodeIslandZ() {
        this.name = "Rhode Island Z";
        this.color = 'lime';
        this.piece = [[0, 1, 1, 0,],
                      [1, 1, 0, 0,],
                      [0, 0, 0, 0,],
                      [0, 0, 0, 0,]];
    }
    Hero() {
        this.name = "Hero";
        this.color = 'cyan';
        // set size, this piece only fits in an 4x4 array
        this.size = 4;
        this.piece = [[0, 0, 0, 0,],
                      [0, 0, 0, 0,],
                      [1, 1, 1, 1,],
                      [0, 0, 0, 0,]];
    }
    Teewee() {
        this.name = "Teewee";
        this.color = 'blueviolet';
        this.piece = [[0, 1, 0, 0,],
                      [1, 1, 1, 0,],
                      [0, 0, 0, 0,],
                      [0, 0, 0, 0,]];
    }
    Smashboy() {
        this.name = "Smash boy";
        this.color = 'yellow';
        // easier to rotate in an 4x4 array
        this.size = 4;
        this.piece = [[0, 0, 0, 0,],
                      [0, 1, 1, 0,],
                      [0, 1, 1, 0,],
                      [0, 0, 0, 0,]];
    }
}