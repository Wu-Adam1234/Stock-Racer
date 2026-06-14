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

function setup() {
    createCanvas(800, 600);
}

function draw() {
    background(30);

    if (gameState === "menu") {
        showMenu();
    } else {
        showGame();
    }
}

function showMenu() {
    fill(255);
    textSize(40);
    textAlign(CENTER);
    text("StockRacer", 400, 150);
    textSize(24);
    text("Press 1 for 1 Player", 400, 300);
    text("Press 2 for 2 Players", 400, 350);
}

function showGame() {
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

    moveCar();
    push();
    translate(carX, carY);
    rotate(carAngle);
    fill(255, 0, 0);
    noStroke();
    rect(-10, -6, 20, 12);
    pop();

    if (numPlayers === 2) {
        moveCar2();
        push();
        translate(car2X, car2Y);
        rotate(car2Angle);
        fill(0, 150, 255);
        noStroke();
        rect(-10, -6, 20, 12);
        pop();
    }
}

function keyPressed() {
    if (gameState === "menu") {
        if (key === "1") { numPlayers = 1; gameState = "playing"; }
        if (key === "2") { numPlayers = 2; gameState = "playing"; }
    }
}

function moveCar() {
    if (keyIsDown(87)) carY -= carSpeed;
    if (keyIsDown(83)) carY += carSpeed;
    if (keyIsDown(65)) carX -= carSpeed;
    if (keyIsDown(68)) carX += carSpeed;

    if (keyIsDown(65)) carSpin -= 0.008;
    if (keyIsDown(68)) carSpin += 0.008;
    carSpin *= 0.95;
    carAngle += carSpin;
}

function moveCar2() {
    if (keyIsDown(UP_ARROW))    car2Y -= carSpeed;
    if (keyIsDown(DOWN_ARROW))  car2Y += carSpeed;
    if (keyIsDown(LEFT_ARROW))  car2X -= carSpeed;
    if (keyIsDown(RIGHT_ARROW)) car2X += carSpeed;

    if (keyIsDown(LEFT_ARROW))  car2Spin -= 0.008;
    if (keyIsDown(RIGHT_ARROW)) car2Spin += 0.008;
    car2Spin *= 0.95;
    car2Angle += car2Spin;
}