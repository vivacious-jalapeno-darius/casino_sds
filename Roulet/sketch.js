// Roulette

const BET_SLIDER_INCREMENT = 1;
const MINIMUM_BET = 1;

let betMultiplier;

let cash;
let cashBet;
let maximumBet;

let rouletteGreen = "#46b96d";
let casinoRed;
let casinoGold;
let rouletteBlack = "black";

let backgroundCircleDiameter = 375;
let sections;
let angles;
let colours = [];
let labelSize;
let textColour = "white";
let betInput;
let amountOfSections;

let angleRotation = 0;
let spinSpeed = 0;
let deceleration = 0.0004;
let isSpinning = false;

let gambleNumberInput;
let gambleNumberSelected;

let selectingGamblingNumberText = "Choose Your Number";

let tableBrown = '#5b3c1f';

let hasCheckedWinner = false;


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
  if (cash === undefined) {
    cash = 100;
  }
  createCanvas(windowWidth, windowHeight);

  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

  betSlider.size = width / 3;
  betSlider.xpos = width/2-betSlider.size/2;
  betSlider.ypos = height/2;  


  input();
}



function draw() {
  background(0);
  if (gameStatus === "start") {
    gambleNumberInput.hide();
    titleText();
  } 


  else if (gameStatus === "select number") {
    betInput.hide();
    amountOfSections.hide();
    gambleNumberInput.show();
    selectNumberScreenText();
  }


  else if (gameStatus === "gamble") {
    background(tableBrown);
    translate(width/2, height/2);
    displayBet();
    makeRoulette(0, 0, 350, sections);
    rouletteRotationUpdate();

    createPointer(0, 0, backgroundCircleDiameter, 20, 40);
    
  }
}



function mousePressed() {
  if (gameStatus === "gamble" && isSpinning === false && cash > 0) {
    spinSpeed = random(0.2, 0.5); // Randomizes the speed so it isn't predictable where it is going to stop
    isSpinning = true;
    hasCheckedWinner = false;
  }
}


function keyPressed() {
  if (keyCode === 13) {
    if (gameStatus === "start" && amountOfSections.value() > 0) {
      sections = int(amountOfSections.value());
      angles = 360 / sections; 
      gameStatus = "select number";
    }

    else if (gameStatus === "select number") {
      gambleNumberSelected = int(gambleNumberInput.value());
      if (gambleNumberSelected >= 0 && gambleNumberSelected < sections){
        gambleNumberInput.hide();
        setPieColours();
        gameStatus = "gamble";
      }
    }
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
  text(`$${betInput.value()}`, width*(7/8), height*(2/5));
}



function input() {
  maximumBet = cash;
  betInput = createSlider(MINIMUM_BET, maximumBet, MINIMUM_BET, BET_SLIDER_INCREMENT);;
  betInput.size(200, 50);
  betInput.position(width*(3/4) - 100, height*(2/5) - 25); 
  cashBet = betInput.value();

  amountOfSections = createInput();
  amountOfSections.size(200, 50);
  amountOfSections.position(width*(3/4) - 100, height*(7/10) - 25); 

  gambleNumberInput = createInput();
  gambleNumberInput.size(200, 50);
  gambleNumberInput.position(width/2 - 100, height/2 - 25);
}



function selectNumberScreenText() {
  textSize(100);
  text(selectingGamblingNumberText, width/2, height*(2/5));
}



function setPieColours() {
  for (let i = 0; i < sections; i++) {
    if (i === gambleNumberSelected) {
      colours.push(casinoGold);
    }
    else if (i === 0) {
      colours.push(rouletteGreen);
    }
    else if (i % 2 === 0) {
      colours.push(casinoRed);
    }
    else if (i % 2 === 1) {
      colours.push(rouletteBlack);
    }
  }
}



function displayBet() {
  textSize(40);
  textAlign(RIGHT, BOTTOM);
  fill(textColour);
  text(`$${cash}`, width/2 - 20, height/2 - 20);
}


function makeRoulette(xCenter, yCenter, diameter, data) {
  lableSizeAdjuster();
  let lastAngle = angleRotation;
  let textRadius = diameter / 2 + 30;
  fill(rouletteBlack);
  circle(xCenter, yCenter, backgroundCircleDiameter);
  
  for (let i = 0; i < data; i++) {
    fill(colours[i]);
    arc(
      xCenter,
      yCenter,
      diameter,
      diameter,
      lastAngle,          
      lastAngle + radians(angles) 
    );

    let currentSliceCenterAngle = lastAngle + radians(angles) / 2;
    let textX = xCenter + cos(currentSliceCenterAngle) * textRadius;
    let textY = yCenter + sin(currentSliceCenterAngle) * textRadius;

    push(); 
    textAlign(CENTER, CENTER);
    textSize(labelSize);
    if (i === gambleNumberSelected) {
      fill(casinoGold);
    } 
    else {
      fill(textColour); // Keep other numbers white
    }
    text(i, textX, textY);
    pop();

    lastAngle += radians(angles); 
  }
}



function lableSizeAdjuster() {
  if (sections < 20) {
    labelSize = 30;
  }
  else if (sections < 50) {
    labelSize = 15;
  }
  else if (sections < 75) {
    labelSize = 10;
  }
  else if (sections < 100) {
    labelSize = 7;
  }
  else {
    labelSize = 5;
  }
}


function rouletteRotationUpdate() {
  if (isSpinning) {
    angleRotation += spinSpeed;
    spinSpeed -= deceleration;

    if (spinSpeed <= 0) {
      spinSpeed = 0;
      isSpinning = false;
      
      if (!hasCheckedWinner) {
        checkWinningNumber();
        hasCheckedWinner = true; 
      }
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



function moneyCalculations(cashBet) {
  betMultiplier = sections;

  if (winningIndex === gambleNumberSelected) {
    cash += cashBet*betMultiplier;
  }
  else {
    cash -= cashBet;
  }
  storeItem('casino_cash', cash);
}



function checkWinningNumber() {

  let rotationDegrees = degrees(angleRotation) % 360;
  if (rotationDegrees < 0) {
    rotationDegrees += 360;
  }

  let pointerTargetAngle = (270 - rotationDegrees + 360) % 360;

  let winningIndex = floor(pointerTargetAngle / angles);

  betMultiplier = sections;

  if (winningIndex === gambleNumberSelected) {
    cash += betInput.value()*betMultiplier;
  }
  else {
    cash -= betInput.value();
  }
  storeItem('casino_cash', cash);


  //moneyCalculations(gambleNumberSelected);
  
}