// Roulette

const BET_SLIDER_INCREMENT = 1;
const MINIMUM_BET = 1;

let cash;

let maximumBet;

let rouletteGreen = "#46b96d";
let casinoRed;
let casinoGold;
let rouletteBlack = "black";

let backgroundCircleDiameter = 375;
let sections;
let angles;
let colors = [];
let labelSize = 25;
let textColour = "white";
let betInput;
let amountOfSections;

let angleRotation = 0;
let spinSpeed = 0;
let deceleration = 0.0004;
let isSpinning = false;

let tableBrown = '#5b3c1f';


// let rlabel = 1.1;

let gameStatus = "start";

let pointer;



let betSlider = {
  slider: undefined,
  size: undefined,
  xpos: undefined,
  ypos: undefined
};



function setup() {

  cash = getItem('casino_cash');
  createCanvas(windowWidth, windowHeight);

  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

  betSlider.size = width / 3;
  betSlider.xpos = width/2-betSlider.size/2;
  betSlider.ypos = height/2;  


  input();
}



function set_pie_colors() {
  for (let i = 0; i < sections; i++) {
    if (i === 0) {
      colors.push(rouletteGreen);
    }
    else if (i % 2 === 0) {
      colors.push(casinoRed);
    }
    else {
      colors.push(rouletteBlack);
    }
  }
}



function draw() {
  if (gameStatus === "start") {
    background(0);
    titleText();
  } 
  else if (gameStatus === "select number") {
    numberSelectionScreen();
  }


  else if (gameStatus === "gamble") {
    betInput.hide();
    amountOfSections.hide();
    background(tableBrown);
    translate(width/2, height/2);

    makeRoulette(0, 0, 350, sections);
    rouletteRotationUpdate();

    createPointer(0, 0, backgroundCircleDiameter, 20, 40);

    
  }
}



function mousePressed() {
  if (gameStatus === "gamble" && isSpinning === false) {
    spinSpeed = random(0.2, 0.5); // Randomizes the speed so it isn't predictable where it is going to stop
    isSpinning = true;
  }
}


function keyPressed() {
  if (keyCode === 13 && gameStatus === "start" && amountOfSections.value() > 0) {
    sections = int(amountOfSections.value());
    angles = 360 / sections; 
    set_pie_colors();
    gameStatus = "gamble";
  }
}



function titleText() {
  textAlign(CENTER, CENTER);
  textSize(150);
  fill(textColour);
  text("Roulette", width/4, height/2);

  textSize(50);
  fill(textColour);
  text("Place bet here", width*(3/4), height*(3/10));
  text("# of sections", width*(3/4), height*(3/5));
  // replace cash with bet slider value
  text(`$${betInput.value()}`, width*(7/8), height*(2/5));
}



function input() {
  maximumBet = cash;
  betInput = createSlider(MINIMUM_BET, maximumBet, MINIMUM_BET, BET_SLIDER_INCREMENT);;
  betInput.size(200, 50);
  betInput.position(width*(3/4) - 100, height*(2/5) - 25); 

  amountOfSections = createInput();
  amountOfSections.size(200, 50);
  amountOfSections.position(width*(3/4) - 100, height*(7/10) - 25); 
}



function numberSelectionScreen() {
  
}


function makeRoulette(xCenter, yCenter, diameter, data) {
  let lastAngle = angleRotation;

  fill(rouletteBlack);
  circle(xCenter, yCenter, backgroundCircleDiameter);
  
  for (let i = 0; i < data; i++) {
    noStroke();
    fill(colors[i]);
    arc(
      xCenter,
      yCenter,
      diameter,
      diameter,
      lastAngle,          
      lastAngle + radians(angles) 
    );
    lastAngle += radians(angles); 
  }
}


function rouletteRotationUpdate() {
  if (isSpinning) {
    angleRotation += spinSpeed;
    spinSpeed -= deceleration;

    if (spinSpeed <= 0) {
      spinSpeed = 0;
      isSpinning = false;
    }
  }
}



function createPointer(xCenter, yCenter, diameter, base, height) {
  pointer = {
    bottomX: xCenter,
    bottomY: yCenter - diameter/2.3,
    leftX: xCenter - base/2,
    leftY: yCenter - diameter/2 - height,
    rightX: xCenter + base/2,
    rightY: yCenter - diameter/2 - height
  };

  fill('white');
  triangle(pointer.bottomX, pointer.bottomY, pointer.leftX, pointer.leftY, pointer.rightX, pointer.rightY);
}