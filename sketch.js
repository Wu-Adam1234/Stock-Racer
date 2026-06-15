let prices = [10, 11, 10.5, 12, 13, 14, 15, 13, 16, 20, 18, 22, 25, 23, 28, 30, 27, 32, 35];
let gameState = "menu";
let numPlayers = 1;
let carX = 50;
let carY = 300;
let carSpeed = 3;
let carAngle = 0;
let carSpin = 0;
let car2X = 50;
let car2Y = 320;
let car2Angle = 0;
let car2Spin = 0;
let winnerId = 0;
let startX, startY;
let carVX = 0;
let carVY = 0;
let car2VX = 0;
let car2VY = 0;
let camX = 0;
let raceTimer = 0;
let gameOver = false;
const GRAVITY = 0.3;
const ACCEL = 0.15;
const MAX_SPEED = 5;
const FRICTION_GROUND = 0.98;
const FRICTION = 0.97;
const JUMP_FORCE = -9;

function setup() {
    let canvas = createCanvas(800, 600);
    canvas.elt.setAttribute ("tabindex", "0");
    canvas.elt.focus();
    startX = 50;
    startY = getTrackY(50);
    carX = startX;
    carY = startY;
    car2X = startX;
    car2Y = startY + 20;
}

function getTrackY(x) {
    for (let i = 0; i < prices.length - 1; i++){
        let x1 = map (i, 0, prices.length - 1, 50, 750);
        let x2 = map (i + 1, 0, prices.length - 1, 50, 750);
        if (x >= x1 && x <= x2) {
            let y1 = map (prices[i], 0, 40, 550, 50);
            let y2 = map (prices[i + 1], 0, 40, 550, 50);
            let t = (x - x1) / (x2 - x1);
            return lerp(y1, y2, t);
        }
    }
    return height;
}

function draw() {
    background(30);

    if (gameState === "menu") {
        showMenu();
    } else if (gameState === "winner") {
        showWinner();
    } else {
        showGame();
    }
}

function showMenu() {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("StockRacer", 400, 150);
    textSize(20);
    text("Press 1 for 1 Player", 400, 300);
    text("Press 2 for 2 Players", 400, 350);
}

function showWinner() {
    background(30);
    textAlign(CENTER, CENTER);
    textSize(52);
    
    if (gameOver && winnerId === 0) {
        fill (220, 60, 60);
        text ("Game Over!", width / 2, 220);
    } else if (gameOver && winnerId === 1) {
        fill (60, 130, 220);
        text ("Game Over!", width / 2, 220);
    } else {
        fill (winnerId === 1 ? color (220, 60, 60) : color (60, 130, 220));
        text ("Player " + winnerId + " Wins!", width / 2, 220);
        fill (255);
        textSize(20);
        text("Press R to Restart or M for Menu", width / 2, 350);
    }
}

function drawFinishLine(){
    let endX = map(prices.length - 1, 0, prices.length - 1, 50, 750);
    if (carX >= endX) {
        winnerId = 1;
        gameState = "winner";
    }
    if (numPlayers === 2 && car2X >= endX) {
        winnerId = 2;
        gameState = "winner";
    }
    stroke (255);
    strokeWeight (2);
    line(endX, 0, endX, height);
}

function checkFinish() {
    let endX = map(prices.length - 1, 0, prices.length - 1, 50, 750);
    if (carX >= endX){
        winnerId = 1;
        gameState = "winner";
    }
    if (numPlayers === 2 && car2X >= endX){
        winnerId = 2;
        gameState = "winner";
    }
}

function showGame() {
    raceTimer += deltaTime / 1000;

    let targetX = numPlayers === 2 ? (carX + car2X) / 2 : carX;
    camX += (targetX - 400 - camX) * 0.08;
    
    push();
    translate(-camX, 0);

    for (let i = 0; i < prices.length; i++) {
        let x = map(i, 0, prices.length - 1, 50, 750);
        let y = map(prices[i], 0, 40, 550, 50);
        fill(255, 255, 0);
        noStroke();
        circle(x, y, 10);
        if (i < prices.length - 1) {
            let x2 = map(i + 1, 0, prices.length - 1, 50, 750);
            let y2 = map(prices[i + 1], 0, 40, 550, 50);
            stroke(255, 255, 0);
            strokeWeight(10);
            line(x, y, x2, y2);
        }
    }

    drawFinishLine();
    checkFinish();

    moveCar();
    push();
    translate(carX, carY);
    rotate(carAngle);
    fill(255, 0, 0);
    noStroke();
    fill (220, 40, 40);
    rect (-12, -5, 24, 10, 3);
    fill (180, 20, 20);
    rect (-4, -10, 12, 7, 2);
    fill (30);
    circle (-8, 6, 8);
    circle (8, 6, 8);
    fill (100);
    circle (-8, 6, 4);
    circle (8, 6, 4);
    pop();

    if (numPlayers === 2) {
        moveCar2();
        push();
        translate(car2X, car2Y);
        rotate(car2Angle);
        fill(0, 150, 255);
        noStroke();
        fill (30, 120, 220);
        rect (-12, -5, 24, 10, 3);
        fill (20, 90, 180);
        rect (-4, -10, 12, 7, 2);
        fill (30);
        circle (-8, 6, 8);
        circle (8, 6, 8);
        fill (100);
        circle (-8, 6, 4);
        circle (8, 6, 4);
        pop();
    }

    pop ();

    fill (255);
    noStroke();
    textSize (16);
    textAlign (LEFT);
    text ("Time: " + nf (raceTimer, 1, 2) + " s", 20, 30);
}

function keyPressed() {
    if (gameState === "menu") {
        if (key === "1") {
            numPlayers = 1;
            gameState = "playing";
        }
        if (key === "2") {
            numPlayers = 2;
            gameState = "playing";
        }
    }
    if (gameState === "winner") {
        if (key === "r" || key === "R") {
            carX = startX;
            carY = startY;
            carAngle = 0;
            carSpin = 0;
            car2X = startX;
            car2Y = startY + 20;
            car2Angle = 0;
            car2Spin = 0;
            winnerId = 0;
            gameState = "playing";
        }
        if (key === "m" || key === "M") {
            carX = startX;
            carY = startY;
            carAngle = 0;
            carSpin = 0;
            car2X = startX;
            car2Y = startY + 20;
            car2Angle = 0;
            car2Spin = 0;
            winnerId = 0;
            gameState = "menu";
        }
    }
}

function moveCar() {
    let onGround = false;
    let groundY = getTrackY(carX);

    if (carY >= groundY) {
        carY = groundY;
        carVY = 0;
        onGround = true;
    }

    if (keyIsDown(87)) carVX = min(carVX + ACCEL, MAX_SPEED);
    if (keyIsDown(83)) carVX = max(carVX - ACCEL, 0);
    
    if (onGround) {
        let slopeX = carX + 5;
        let slopeY = getTrackY (slopeX);
        carAngle = atan2 (slopeY - groundY, 5);
        carSpin = 0;
    } else {
        if (keyIsDown (68)) carSpin += 0.06;
        if (keyIsDown (65)) carSpin -= 0.06;
        carSpin *= FRICTION;
        carAngle += carSpin;
    }

    if (onGround && (abs (carAngle) > PI * 0.6)) {
        gameOver = true;
        gameState = "winner";
        winnerId = 2;
    }

    carVY += GRAVITY;
    carX += carVX;
    carY += carVY;
    carX = constrain (carX, 50, 750);
}

function moveCar2() {
    let onGround = false;
    let groundY = getTrackY(car2X);

    if (car2Y >= groundY) {
        car2Y = groundY;
        car2VY = 0;
        onGround = true;
    }

    if (keyIsDown (UP_ARROW)) car2VX = min (car2VX + ACCEL, MAX_SPEED);
    if (keyIsDown (DOWN_ARROW)) car2VX = max (car2VX - ACCEL, 0);

    if (onGround) {
        let slopeX = car2X + 5;
        let slopeY = getTrackY (slopeX);
        car2Angle = atan2 (slopeY - groundY, 5);
        car2Spin = 0;
    } else {
        if (keyIsDown (RIGHT_ARROW)) car2Spin += 0.06;
        if (keyIsDown (LEFT_ARROW)) car2Spin -= 0.06;
        car2Spin *= FRICTION;
        car2Angle += car2Spin;
    }

    if (onGround && (abs (car2Angle) > PI * 0.6)) {
        gameOver = true;
        gameState = "winner";
        winnerId = 1;
    }

    car2VY += GRAVITY;
    car2X += car2VX;
    car2Y += car2VY;
    car2X = constrain (car2X, 50, 750);
}