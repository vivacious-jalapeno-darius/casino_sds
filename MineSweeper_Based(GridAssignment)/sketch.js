// --------------------------------------------------------------------------------
// Grid Based Assignment
// Gambling (BIG VON'S CASINO)
// Vivaan Jalla-Dhar
// April 12, 2026
//
// Extra for Experts:
// - Adding touchscreen, a slider, and sound
// -- When the user touches a part of the screen, it will act the same as mousePressed(), allowing people to play on PC and mobile
// -- The slider is so players can set the betting amount
// -- Sound is played when the player clicks a prize or clicks a flashbang square
// --------------------------------------------------------------------------------


// ------------------------- VARIABLES ------------------------- \\

// --------------- CONSTANTS --------------- \\
// ----- SCREEN ----- \\
const SCREEN_LEFT_SIDE = 0;
const SCREEN_TOP_SIDE = 0;

// ----- TITLE SCREEN ----- \\
const TITLE_TEXT = "BIG VON'S CASINO";

// act like """ """ (triple quotes) from python
// INTENTIONALLY VERY SMALL
const SUB_TITLE_TEXT = `All $$$ goes straight to Vivaan Jalla-Dhar (no refunds).
Please play responsibly.
Must be 10+ to play`; // don't question it

// ----- TOTAL CASH DISPLAY / OTHER CASH RELATED CONSTANTS ----- \\
const CASH_DISPLAY_TEXT_SIZE = 60;

const DECIMAL_PLACES_2 = 2;
const DECIMAL_ROUNDER = 100;

const BROKE = 0;

// ----- BETTING SLIDER ----- \\
const BET_SLIDER_INCREMENT = 1;
const MINIMUM_BET = 1;

// ----- MONEY MULTIPLIER ----- \\
const MONEY_MULTIPLIER = 1.05;
const MULTIPLIER_DISPLAY_TEXT_SIZE = 40;

// ----- TABLE GENERATION ----- \\
const TABLE_SQUARE_SIZE = 135;
const TABLE_SUMMON_DELAY_TIME = 100; // milliseconds

const PERCENTAGE = 100;
const CHANCE_TO_GET_PRIZE = 90;

// ----- LOSS AND REWARD FROM GAMBLING ----- \\
const MONEY_LOSS = 0;
const REWARD = 1;
const REVEALED = 2;

const THREE_SECOND_FLASHBANG_TIMER = 3000;

//  -   -   -   -   -   -   -   -   -   -   -   - 


// ----- GAME STATUS ----- \\
let gameStatus = "start";


// ----- MOUSE ----- \\
let mouseXpos;
let mouseYpos;


// ----- SCREEN CENTERS / MARGIN ----- \\
let screenCenterx;
let screenCentery;
let margin = TABLE_SQUARE_SIZE/4;


// ----- COLOURS ----- \\
let casinoRedBackground = "#B30000";
let casinoGoldTable = "#EFBF04";
let textColour = "black";


// ----- TITLE SCREEN ----- \\
let titleSize;
let titleypos;
let subTitleSize;
let subTitleypos;
let font;


// ----- MAKE BETS SCREEN ----- \\
let cash = 100;
let cashDisplay;

// minimum and maximum betting amount
let maximumBet = cash;


// ----- GAMBLING ----- \\
// table generation
let tableRows;
let tableCols;
let grid;
let tableXpos;
let tableYpos;

// multiplier
let moneyMultiplierValue = 1;
let multiplierDisplay;

// prize
let mysteryBox;
let prize;
let prizeCollectedSound;

let newCashValue = 0;

// dead
let deviousLaugh;



// ---------- OBJECT NOTATION ---------- \\

let startScreenButton = {
  button: undefined,
  text: "BEGIN",
  width: undefined,
  height: undefined,
  xpos: undefined,
  ypos: undefined
};


let betSlider = {
  slider: undefined,
  size: undefined,
  xpos: undefined,
  ypos: undefined
};


let betPlaced = {
  value: undefined,
  ypos: undefined
};


let beginGambling = {
  button: undefined,
  text: "BET",
  width: undefined,
  height: undefined,
  xpos: undefined,
  ypos: undefined
};


let cashOut = {
  button: undefined,
  text: "CASH OUT",
  width: undefined,
  height: undefined,
  xpos: undefined,
  ypos: undefined
};

// -------------------------------------------------------------------



// ------------------------- 1 TIME FUNCTIONS ------------------------ \\
function preload(){
  mysteryBox = loadImage('Images/mystery_box.png');
  font = loadFont("Fonts/AmericanCaptain-MdEY.otf");
  prize = loadImage("Images/money(prize).jpg");
  prizeCollectedSound = loadSound("Sounds/YAHOO SOUND EFFECT (MARIO).mp3");
  deviousLaugh = loadSound("Sounds/death_sfx 1.wav");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  restateVariables();
  startButton();
  selectingBetSlider();
  letsGoGamblingButton();
  withdrawButton();
}



// This is because width and height aren't defined when setting a GLOBAL variable
function restateVariables() {
  // for vertical screens
  if (width < height) {
    titleSize = width/6;
  }
  // for horizontal screens
  else {
    titleSize = (width + height) /10;
  }

  subTitleSize = (width + height) / 350;

  // title and subtitle y position
  titleypos = height * (2/5);
  subTitleypos = height * (3/5);

  // screen centers
  screenCenterx = width/2;
  screenCentery = height/2;


  // ----- START SCREEN BUTTON ----- \\
  // dimensions
  startScreenButton.width = width/8;
  startScreenButton.height = 30;

  // position
  startScreenButton.xpos = screenCenterx - startScreenButton.width/2;
  startScreenButton.ypos = height * (4/5);


  // ----- BET SLIDER ----- \\
  betSlider.size = width / 3;
  betSlider.xpos = screenCenterx-betSlider.size/2;
  betSlider.ypos = height/2;
  

  // ----- BET TEXT ----- \\
  betPlaced.ypos = height * (2/5);

  
  // ----- BEGIN GAMBLING BUTTON ----- \\
  // dimensions
  beginGambling.width = width/6;
  beginGambling.height = 60;
  
  // position
  beginGambling.xpos = screenCenterx - beginGambling.width/2;
  beginGambling.ypos = height * (4/5);


  // ----- CASH OUT BUTTON ----- \\
  // dimensions
  cashOut.width = width/8;
  cashOut.height = 30;

  // position
  cashOut.xpos = screenCenterx - cashOut.width/2;
  cashOut.ypos = cashOut.height;
}



function startButton() {
  startScreenButton.button = createButton(startScreenButton.text);
  startScreenButton.button.size(startScreenButton.width, startScreenButton.height);
  startScreenButton.button.position(startScreenButton.xpos, startScreenButton.ypos);
  startScreenButton.button.style('background-color', casinoGoldTable);
  startScreenButton.button.mousePressed(makeBetsTransition);
}



function selectingBetSlider() {
  betSlider.slider = createSlider(MINIMUM_BET, maximumBet, MINIMUM_BET, BET_SLIDER_INCREMENT);
  betSlider.slider.size(betSlider.size);
  betSlider.slider.position(betSlider.xpos, betSlider.ypos);
  betSlider.slider.hide();
}



function letsGoGamblingButton() {
  beginGambling.button = createButton(beginGambling.text);
  beginGambling.button.size(beginGambling.width, beginGambling.height);
  beginGambling.button.position(beginGambling.xpos, beginGambling.ypos);
  beginGambling.button.style('background-color', casinoGoldTable);
  beginGambling.button.mousePressed(summonGamblingTable);
  beginGambling.button.hide();
}



function withdrawButton() {
  cashOut.button = createButton(cashOut.text);
  cashOut.button.size(cashOut.width, cashOut.height);
  cashOut.button.position(cashOut.xpos, cashOut.ypos);
  cashOut.button.style('background-color', casinoGoldTable);
  cashOut.button.mousePressed(backToBetsScreen);
  cashOut.button.hide();
}




// ------------------------- LOOPING FUNCTIONS -------------------------\\
function draw() {
  background(casinoRedBackground);
  if (gameStatus === "start") {
    startScreen();
  }
  else if (gameStatus === "make bets") {
    makeBetsScreen();
  }
  else if (gameStatus === "gambling") {
    makeTable();
    showMultiplier();
  }
  else if (gameStatus === "lose") {
    flashBang();
  }
}
// -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   - \\



// ---------- "start" Game Status ----------\\
function startScreen(){
  textAlign(CENTER, CENTER);
  textSize(titleSize);
  fill(textColour);
  textFont(font);
  text(TITLE_TEXT, screenCenterx, titleypos);
  textSize(subTitleSize);
  text(SUB_TITLE_TEXT, screenCenterx, subTitleypos);
}


// ----- "start" >>> "make bets" Transition ----- \\
function makeBetsTransition(){
  gameStatus = "make bets";
  startScreenButton.button.hide();
  betSlider.slider.show();
  beginGambling.button.show();
}

 

// ---------- "make bets" Game Status ---------- \\
function makeBetsScreen() {
  let roundCashValue = Math.round(cash * DECIMAL_ROUNDER) / DECIMAL_ROUNDER;
  // adds commas to the cashDisplay to make it look cleaner
  cashDisplay = `$${nfc(roundCashValue, DECIMAL_PLACES_2)}`;
  textSize(CASH_DISPLAY_TEXT_SIZE);
  fill("black");
  text(cashDisplay, screenCenterx, CASH_DISPLAY_TEXT_SIZE);

  // bet slider
  if (cash <= 1) {
    maximumBet = 1; 
  } 
  else {
    maximumBet = cash;
  }

  // updates the max limit on the bet slider after every round to follow the logic of the if else statements above 
  betSlider.slider.elt.max = maximumBet; 

  betPlaced.value = betSlider.slider.value();
  text(`Bet: $${nfc(betPlaced.value)}`, screenCenterx, betPlaced.ypos);
}



function backToBetsScreen(){
  gameStatus = "make bets";
  moneyMultiplierValue = MONEY_MULTIPLIER; 
  betSlider.slider.show();
  beginGambling.button.show();
  cashOut.button.hide();
}



// ----- "make bets" >>> "gambling" Transition ----- \\
function summonGamblingTable() {
  mathFlooringTable(); 
  grid = generateGamblingGrid(tableCols, tableRows);

  // sets 100ms delay between when bet button is pressed and when the table summons
  // this is so that a square isn't already clicked when the 'bet' button is pressed
  setTimeout(() => {
    gameStatus = "gambling";
    betSlider.slider.hide();
    beginGambling.button.hide();
    cashOut.button.show();
  }, TABLE_SUMMON_DELAY_TIME); 
}



// ---------- "gambling" Game Status ---------- \\
function makeTable() {
  if (gameStatus === "gambling") {
    let totalGridWidth = tableCols * TABLE_SQUARE_SIZE;
    let totalGridHeight = tableRows * TABLE_SQUARE_SIZE;

    let offsetX = (width - totalGridWidth) / 2;
    let offsetY = (height - totalGridHeight) / 2;

    for (let i = 0; i < tableRows; i++) {
      for (let j = 0; j < tableCols; j++) { 
        fill(casinoGoldTable);
        
        let xPos = offsetX + j * TABLE_SQUARE_SIZE;
        let yPos = offsetY + i * TABLE_SQUARE_SIZE;

        square(xPos, yPos, TABLE_SQUARE_SIZE);

        if (grid[i][j] === REVEALED) {
          image(prize, xPos, yPos, TABLE_SQUARE_SIZE, TABLE_SQUARE_SIZE);
        } 
        else {
          image(mysteryBox, xPos, yPos, TABLE_SQUARE_SIZE, TABLE_SQUARE_SIZE);
        }
      }
    }
  }
}



function generateGamblingGrid(tableCols, tableRows) {
  let newGrid = [];
  for (let y = 0; y < tableRows; y++) {
    newGrid.push([]);
    for (let x = 0; x < tableCols; x++) {
      if (random(PERCENTAGE) < CHANCE_TO_GET_PRIZE) { // 90% chance of getting prize
        newGrid[y].push(REWARD);
        
      } 
      else {
        newGrid[y].push(MONEY_LOSS); 
      }
    }
  }
  return newGrid;
}



function showMultiplier() {
  let roundMultiplierValue = Math.round(moneyMultiplierValue * DECIMAL_ROUNDER) / DECIMAL_ROUNDER;
  multiplierDisplay = `x${roundMultiplierValue}`;
  textSize(MULTIPLIER_DISPLAY_TEXT_SIZE);
  fill("black");
  text(multiplierDisplay, width - MULTIPLIER_DISPLAY_TEXT_SIZE, height - MULTIPLIER_DISPLAY_TEXT_SIZE);
}



function mathFlooringTable() {
  tableCols = Math.floor((width - margin * 2) / TABLE_SQUARE_SIZE);
  tableRows = Math.floor((height - margin * 2) / TABLE_SQUARE_SIZE);
}



// when ever the user touches a part of the screen, it will impliment the same things as when mousePressed()
function touchStarted() {
  if (gameStatus === "gambling") {
    mousePressed();
  }
  // this allows for the player to click button and grid (touchscreen device only)
  return true;
}



function mousePressed() {
  if (gameStatus === "gambling") {
    let totalGridWidth = tableCols * TABLE_SQUARE_SIZE;
    let totalGridHeight = tableRows * TABLE_SQUARE_SIZE;
    let offsetX = (width - totalGridWidth) / 2;
    let offsetY = (height - totalGridHeight) / 2;
    let clickedCol = Math.floor((mouseX - offsetX) / TABLE_SQUARE_SIZE);
    let clickedRow = Math.floor((mouseY - offsetY) / TABLE_SQUARE_SIZE);
    revealMysteryBox(clickedCol, clickedRow);
  }
}



function revealMysteryBox(mouseXpos, mouseYpos) {
  if (mouseXpos >= SCREEN_LEFT_SIDE && mouseXpos < tableCols && mouseYpos >= SCREEN_TOP_SIDE && mouseYpos < tableRows) {
    let gridValue = grid[mouseYpos][mouseXpos];

    // ----- MATH/CASH CALCULATION ----- \\
    if (gridValue === REWARD) {
      grid[mouseYpos][mouseXpos] = REVEALED;
      
      let winnings = betPlaced.value * moneyMultiplierValue;
      newCashValue = cash + winnings;
      cash += abs(newCashValue);
      moneyMultiplierValue *= MONEY_MULTIPLIER;
      prizeCollectedSound.play();
    } 

    else if (gridValue === MONEY_LOSS) {
      let lossAmount = newCashValue * moneyMultiplierValue;
      newCashValue += lossAmount;
      if (newCashValue < BROKE) {
        // adds because if broke (cash in negatives) then it will be cash -= (-newCashValue) which essentially means cash += newCashValue
        cash += newCashValue;
      }
      else {
        cash -= newCashValue;
      }
      
      gameStatus = "lose";
      cashOut.button.hide();
      lossStartTime = millis();
      deviousLaugh.play();
      newCashValue = BROKE;
    }
  }
}



function flashBang() {
  background("white");
  if (millis() - lossStartTime > THREE_SECOND_FLASHBANG_TIMER) {
    // changes game states after 3s of flashbang
    gameStatus = "make bets";
    moneyMultiplierValue = MONEY_MULTIPLIER; 
    betSlider.slider.show();
    beginGambling.button.show();
  }
}


