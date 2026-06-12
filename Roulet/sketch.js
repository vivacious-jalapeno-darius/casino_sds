// Roulette

const BET_SLIDER_INCREMENT = 0.01;
const MINIMUM_BET = 1;
const BILLION = 1000000000;

const BASE_TEXT_SIZE = 40;
const LABEL_SIZE_LARGE = 30;
const LABEL_SIZE_MEDIUM = 15;
const LABEL_SIZE_SMALL = 10;
const LABEL_SIZE_XSMALL = 7;
const LABEL_SIZE_TINY = 5;

const SECTION_THRESHOLD_LOW = 20;
const SECTION_THRESHOLD_MID = 50;
const SECTION_THRESHOLD_HIGH = 75;
const SECTION_THRESHOLD_MAX = 100;

const DISPLAY_BET_OFFSET = 20;
const TEXT_RADIUS_OFFSET = 30;
const CIRCLE_DIVIDER_HALF = 2;
const POINTER_Y_DIVIDER = 2.3;
const FULL_ROTATION_DEGREES = 360;
const POINTER_TOP_ANGLE_DEGREES = 270;

const MIN_SECTIONS_TO_PLAY = 1;
const RESET_SPEED = 0;
const BROKE = 0.01;

const DECIMAL_PLACES = 2;

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

let selectingGamblingNumberText = `Choose Your Number: 
The # you choose can't be the same as the # of sections. 
Section #s start at 0.`;

let tableBrown = '#5b3c1f';

let hasCheckedWinner = false;

let gameStatus = "start";

let pointer;

let tickSound;



let betSlider = {
  slider: undefined,
  size: undefined,
  xpos: undefined,
  ypos: undefined
};


function preload() {
  tickSound = loadSound('tick.mp3');
  cash = getItem('casino_cash');
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  
  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

  betSlider.size = width / 3;
  betSlider.xpos = width/2-betSlider.size/2;
  betSlider.ypos = height/2;
  
  home(homeButton);

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

    if (isSpinning) {
      let currentSection = getCurrentSection();
      if (currentSection !== lastTickSection) {
        playTick();
        lastTickSection = currentSection;
      }
    }
  }
}


function mousePressed() {
  if (gameStatus === "gamble" && isSpinning === false && cash > 0) {

    spinSpeed = random(0.2, 0.5);
    isSpinning = true;
    hasCheckedWinner = false;
    lastTickSection = getCurrentSection(); // don't tick on the section we start on
  }
}


function keyPressed() {
  if (keyCode === 13) {
    if (gameStatus === "start" && amountOfSections.value() > 0) {
      sections = Math.floor(Number(amountOfSections.value()));
      angles = 360 / sections; 
      gameStatus = "select number";
    }

    else if (gameStatus === "select number") {
      gambleNumberSelected = Math.floor(Number(gambleNumberInput.value()));
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

  textSize(40);
  fill(textColour);
  text("Place bet here", width*(3/4), height*(3/10));
  text("# of sections", width*(3/4), height*(3/5));
  textSize(30);
  if (cash >= BILLION) {
    textSize(15);
  }
  text(`$${nfc(betInput.value(), 2)}`, width*(7/8), height*(2/5));
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
  textSize(50);
  text(selectingGamblingNumberText, width/2, height*(3/10));
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
  textSize(BASE_TEXT_SIZE);
  textAlign(RIGHT, BOTTOM);
  fill(textColour);
  
  text(`$${nfc(cash, DECIMAL_PLACES)}`, width/2 - 20, height/2 - 20);
}


function makeRoulette(xCenter, yCenter, diameter, data) {
  lableSizeAdjuster();
  let lastAngle = angleRotation;
  let textRadius = diameter / CIRCLE_DIVIDER_HALF + TEXT_RADIUS_OFFSET;
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
      fill(textColour);
    }
    text(i, textX, textY);
    pop();

    lastAngle += radians(angles); 
  }
}


function lableSizeAdjuster() {
  if (sections < SECTION_THRESHOLD_LOW) {
    labelSize = LABEL_SIZE_LARGE;
  }
  else if (sections < SECTION_THRESHOLD_MAX) {
    labelSize = LABEL_SIZE_MEDIUM;
  }
  else if (sections < SECTION_THRESHOLD_HIGH) {
    labelSize = LABEL_SIZE_SMALL;
  }
  else if (sections < SECTION_THRESHOLD_MAX) {
    labelSize = LABEL_SIZE_XSMALL;
  }
  else {
    labelSize = LABEL_SIZE_TINY;
  }
}


function rouletteRotationUpdate() {
  if (isSpinning) {
    angleRotation += spinSpeed;
    spinSpeed -= deceleration;

    if (spinSpeed <= RESET_SPEED) {
      spinSpeed = RESET_SPEED;
      isSpinning = false;
      
      if (!hasCheckedWinner) {
        checkWinningNumber();
        hasCheckedWinner = true; 
      }
    }
  }
}

function playTick() {
  tickSound.play();
}


function getCurrentSection() {
  let rotationDegrees = degrees(angleRotation) % FULL_ROTATION_DEGREES;
  if (rotationDegrees < RESET_SPEED) {
    rotationDegrees += FULL_ROTATION_DEGREES;
  }
  let pointerTargetAngle = (POINTER_TOP_ANGLE_DEGREES - rotationDegrees + FULL_ROTATION_DEGREES) % FULL_ROTATION_DEGREES;
  return floor(pointerTargetAngle / angles);
}


function createPointer(xCenter, yCenter, diameter, base, height) {
  pointer = {
    bottomX: xCenter,
    bottomY: yCenter - diameter/POINTER_Y_DIVIDER,
    leftX: xCenter - base/CIRCLE_DIVIDER_HALF,
    leftY: yCenter - diameter/CIRCLE_DIVIDER_HALF - height,
    rightX: xCenter + base/CIRCLE_DIVIDER_HALF,
    rightY: yCenter - diameter/CIRCLE_DIVIDER_HALF - height
  };

  fill('white');
  triangle(pointer.bottomX, pointer.bottomY, pointer.leftX, pointer.leftY, pointer.rightX, pointer.rightY);
}


function checkWinningNumber() {
  let rotationDegrees = degrees(angleRotation) % FULL_ROTATION_DEGREES;
  if (rotationDegrees < RESET_SPEED) {
    rotationDegrees += FULL_ROTATION_DEGREES;
  }
 
  let pointerTargetAngle = (POINTER_TOP_ANGLE_DEGREES - rotationDegrees + FULL_ROTATION_DEGREES) % FULL_ROTATION_DEGREES;
  let winningIndex = floor(pointerTargetAngle / angles);

  betMultiplier = sections;

  if (sections === MIN_SECTIONS_TO_PLAY) {
    // no opperation
  }
  else if (winningIndex === gambleNumberSelected) {
    cash += betInput.value() * betMultiplier;
  }
  else {
    cash -= betInput.value();
  }

  storeItem('casino_cash', cash);

  if (cash <= BROKE) {
    window.location.href = "../index.html";
  }
}