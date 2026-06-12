// Super Smash Balls

// ---------- CONSTANTS ---------- \\
// --- GENERAL COLOURS --- \\
const SCORE_INPUT_BACKGROUND_COLOUR = '#1a1a1a';
const WHITE = 255;

// --- PLATFORM --- \\
const PLATFORM = {
  x: 0,      
  y: 0,      
  width: 700, 
  height: 15,
  colour: 100
};

// --- PLAYER COLOURS --- \\
const P1_COLOUR = {
  r: 68, 
  g: 170, 
  b: 255
};

const P2_COLOUR = {
  r: 255, 
  g: 85, 
  b: 85
};

const SCOREBOARD = {
  size: 40,
  dashColour: 150,
  ypos: 30
};

const BET_PLACED_VALUE_DISPLAY = {
  xpos: undefined,
  ypos: undefined,
  textSize: 18
};
const KEY_MAPPING_TEXT = {
  colour: 167,
  size: 30
};

const PLAYER_RADIUS = 20;
const NUMBER_OF_PARTICLES = 50;

const RESTART_SCORE = 0;
const PLAYER_MAX_SCORE = 5;



// ---------- VARIABLES ---------- \\

let GROUND;
let particleArray = [];
let cash;
let casinoRed, casinoGold;

let p1;
let p2; 
let score1 = 0;
let score2 = 0;

let validateScoreBet1, validateScoreBet2;

let pred1Input, pred2Input, confirmButton;
let errorMessage = '';

// --- CASH BET --- \\
let betSlider, confirmBetButton;
let betAmount = 0;


// ----- GAME STATUS ----- \\
let gameStatus = "score prediction";



// --------------- CLASS --------------- \\
class Particle {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = r;
    this.g = g;
    this.b = b;
    this.opacity = 255;
  }

  update() {
    this.opacity -= 4; 
    this.x += this.dx;
    this.y += this.dy;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }

  isDead() {
    return this.opacity <= 0;
  }
}



// --------------- FUNCTIONS --------------- \\
function setup() {
  const SCREEN_HEIGHT_4_5ths = windowHeight * (4/5);  
  const PLATFORM_X_POSITION = (windowWidth - PLATFORM.width) / 2;
  BET_PLACED_VALUE_DISPLAY.xpos = width-20;
  BET_PLACED_VALUE_DISPLAY.ypos = height-30;


  // local storage
  cash = getItem('casino_cash');
  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

  createCanvas(windowWidth, windowHeight);

  // button to return to mainscreen (../)
  home(homeButton);
  
  PLATFORM.x = PLATFORM_X_POSITION;
  PLATFORM.y = SCREEN_HEIGHT_4_5ths; 
  GROUND = PLATFORM.y - PLAYER_RADIUS;


  reset();
  if (gameStatus === "score prediction") {
    setupPredictionScreen();
  }
}


function setupPredictionScreen() {

  // ----- INPUT/BUTTON STYLE & PROPERTIES ----- \\
  pred1Input = createInput();
  pred1Input.attribute('placeholder', '0');
  pred1Input.attribute('maxlength', '1');
  pred1Input.style('font-size', '36px');
  pred1Input.style('text-align', 'center');
  pred1Input.style('background-color', SCORE_INPUT_BACKGROUND_COLOUR);
  pred1Input.style('color', `rgb(${P1_COLOUR.r}, ${P1_COLOUR.g}, ${P1_COLOUR.b})`);
  pred1Input.style('border', `3px solid ${casinoGold}`);
  pred1Input.style('border-radius', '8px');
  pred1Input.style('font-family', 'monospace');
  pred1Input.style('outline', 'none');
  pred1Input.style('width', '70px');
  pred1Input.size(70, 60);
  pred1Input.position(width / 2 - 120, height / 2);

  pred2Input = createInput();
  pred2Input.attribute('placeholder', '0');
  pred2Input.attribute('maxlength', '1');
  pred2Input.style('font-size', '36px');
  pred2Input.style('text-align', 'center');
  pred2Input.style('background-color', SCORE_INPUT_BACKGROUND_COLOUR);
  pred2Input.style('color', `rgb(${P2_COLOUR.r}, ${P2_COLOUR.g}, ${P2_COLOUR.b})`);
  pred2Input.style('border', `3px solid ${casinoGold}`);
  pred2Input.style('border-radius', '8px');
  pred2Input.style('font-family', 'monospace');
  pred2Input.style('outline', 'none');
  pred2Input.style('width', '70px');
  pred2Input.size(70, 60);
  pred2Input.position(width / 2 + 50, height / 2);

  confirmButton = createButton('CONFIRM');
  confirmButton.size(160, 55);
  confirmButton.position(width / 2 - 80, height / 2 + 110);
  confirmButton.style('background-color', casinoGold);
  confirmButton.style('color', 'black');
  confirmButton.style('font-size', '22px');
  confirmButton.style('font-weight', 'bold');
  confirmButton.style('font-family', 'monospace');
  confirmButton.style('cursor', 'pointer');
  confirmButton.style('border', '3px solid black');
  confirmButton.style('border-radius', '8px');
  confirmButton.mousePressed(confirmPrediction);
}


function confirmPrediction() {
  validateScoreBet1 = Number(pred1Input.value());
  validateScoreBet2 = Number(pred2Input.value());

  let valid =
    !isNaN(validateScoreBet1) && !isNaN(validateScoreBet2) &&
    validateScoreBet1 >= 0 && validateScoreBet1 <= 5 &&
    validateScoreBet2 >= 0 && validateScoreBet2 <= 5 &&
    (validateScoreBet1 === 5 || validateScoreBet2 === 5) &&
    validateScoreBet1 !== validateScoreBet2 &&
    validateScoreBet1 + validateScoreBet2 < 10;

  if (valid) {
    // Move to cash bet screen instead of directly to battle
    gameStatus = "cash bet";
    pred1Input.remove();
    pred2Input.remove();
    confirmButton.remove();
    errorMessage = '';
    setupCashBetScreen();
  } 
  else {
    errorMessage = 'Scores must be whole numbers between 0-5 and one MUST be 5 and no score can be > 5';
  }
}


// --- Cash Bet Screen Setup ---
function setupCashBetScreen() {
  let currentCash = cash || 0;

  betSlider = createSlider(1, currentCash, 1, 0.01);
  betSlider.size(340, 8);
  betSlider.position(width / 2 - 170, height / 2 + 20);
  betSlider.style('appearance', 'none');
  betSlider.style('-webkit-appearance', 'none');
  betSlider.style('background', 'transparent');
  betSlider.style('outline', 'none');
  betSlider.style('cursor', 'pointer');

  // Inject slider thumb/track styles once
  if (!document.getElementById('betSliderStyle')) {
    let styleTag = document.createElement('style');
    styleTag.id = 'betSliderStyle';
    styleTag.textContent = `
      #betSliderStyle-range::-webkit-slider-runnable-track {
        height: 6px; border-radius: 3px; background: #444;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 28px; height: 28px;
        border-radius: 50%;
        background: ${casinoGold};
        border: 3px solid #000;
        margin-top: -11px;
        cursor: pointer;
      }
      input[type=range]::-moz-range-thumb {
        width: 28px; height: 28px;
        border-radius: 50%;
        background: ${casinoGold};
        border: 3px solid #000;
        cursor: pointer;
      }
      input[type=range]::-webkit-slider-runnable-track {
        height: 6px; border-radius: 3px; background: #444;
      }
      input[type=range]::-moz-range-track {
        height: 6px; border-radius: 3px; background: #444;
      }
    `;
    document.head.appendChild(styleTag);
  }

  confirmBetButton = createButton('PLACE BET');
  confirmBetButton.size(200, 55);
  confirmBetButton.position(width / 2 - 100, height / 2 + 110);
  confirmBetButton.style('background-color', casinoGold);
  confirmBetButton.style('color', 'black');
  confirmBetButton.style('font-size', '22px');
  confirmBetButton.style('font-weight', 'bold');
  confirmBetButton.style('font-family', 'monospace');
  confirmBetButton.style('cursor', 'pointer');
  confirmBetButton.style('border', '3px solid black');
  confirmBetButton.style('border-radius', '8px');
  confirmBetButton.mousePressed(confirmBet);
}


// --- Confirm Cash Bet Logic ---
function confirmBet() {
  betAmount = Number(betSlider.value());
  gameStatus = "battle";
  betSlider.remove();
  confirmBetButton.remove();
}


// --- NEW: Resolve the bet once the game ends ---
function resolveBet() {
  let currentCash = cash;
  if (score1 === validateScoreBet1 && score2 === validateScoreBet2) {
    // Correct prediction: add winnings
    storeItem('casino_cash', currentCash + betAmount);
  } 
  else {
    // Wrong prediction: deduct bet
    storeItem('casino_cash', currentCash - betAmount);
  }
}


function reset() {
  p1 = { 
    x: PLATFORM.x + PLATFORM.width * 0.25, 
    y: GROUND, 
    dx: 0, 
    dy: 0, 
    grounded: true, 
    bump: 0, 
    rotation: 0, 
    eyes: 6 // face right
  };

  p2 = {
    x: PLATFORM.x + PLATFORM.width * 0.75, 
    y: GROUND, 
    dx: 0, 
    dy: 0, 
    grounded: true, 
    bump: 0, 
    rotation: 0,
    eyes: -6 // face left
  };
}
 
 
function keyPressed() {
  // [Left Shift] P1
  if (event.code === 'ShiftLeft') { 
    p1.dx += 1.8; 
    p1.bump = 6; 
  } 
  
  // [Right Shift] P2
  if (event.code === 'Enter') { 
    p2.dx -= 1.8; 
    p2.bump = 6;
  }
} 

function triggerFireworkBurst(x, y, r, g, b) {
  for (let i = 0; i < NUMBER_OF_PARTICLES; i++) {
    let death = new Particle(x, y, r, g, b);
    particleArray.push(death);
  }
}
 
function updateGame() {
  p1.dx *= 0.989; // 0.97;
  p2.dx *= 0.989; // 0.97;
  
  p1.x += p1.dx;
  p2.x += p2.dx;
 
  if (p1.grounded) {
    p1.rotation += p1.dx / PLAYER_RADIUS;
  }

  if (p2.grounded) {
    p2.rotation += p2.dx / PLAYER_RADIUS;
  }
 
  for (let player of [p1, p2]) {
    if (!player.grounded) { 
      player.dy += 0.5; 
      player.y += player.dy; 
      player.rotation += player.dx / PLAYER_RADIUS; 
    }
    if (player.bump > 0) {
      player.bump--;
    }
  }
  
  let collisionDistance = dist(p1.x, p1.y, p2.x, p2.y);
  let minDist = PLAYER_RADIUS * 2;
  
  if (collisionDistance < minDist) {
    let overlap = minDist - collisionDistance;
    let dx = p2.x - p1.x;
    if (dx === 0) {
      dx = 0.1;
    }

    p1.x -= dx / collisionDistance * overlap * 0.5;
    p2.x += dx / collisionDistance * overlap * 0.5;
    
    let tempdx = p1.dx;
    p1.dx = p2.dx * 1.1;
    p2.dx = tempdx * 1.1;
  }
 
  if (p1.grounded && p1.x < PLATFORM.x) { 
    p1.grounded = false; 
    p1.dy = -2; 
  }

  if (p2.grounded && p2.x > PLATFORM.x + PLATFORM.width) { 
    p2.grounded = false; 
    p2.dy = -2; 
  }
 
  if (!p1.grounded && p1.y > height + 10) { 
    triggerFireworkBurst(p1.x, height, P1_COLOUR.r, P1_COLOUR.g, P1_COLOUR.b); 
    score2++; 
    reset(); 
  }
  if (!p2.grounded && p2.y > height + 10) { 
    triggerFireworkBurst(p2.x, height, P2_COLOUR.r, P2_COLOUR.g, P2_COLOUR.b);  
    score1++; 
    reset(); 
  }
}
 
function drawPlayer(player, col) {
  push();
  translate(player.x, player.y);
  rotate(player.rotation);
  
  let gameScale = player.bump > 0 ? 1.2 : 1;
  scale(gameScale, gameScale);
  
  fill(col);
  noStroke();
  circle(0, 0, PLAYER_RADIUS * 2);
  
  
  noStroke();
  fill(0);
  circle(player.eyes, -4, 6);
  
  pop();
}
 
function draw() {
  background(0);

  // Gold top and bottom bar
  fill(casinoGold || '#EFBF04');
  noStroke();
  rect(0, 0, width, 8);
  rect(0, height - 8, width, 8);


  // ── SCREEN 1: SCORE PREDICTION ──
  if (gameStatus === "score prediction") {

    // Title
    fill(casinoGold);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(38);
    text('What is your score prediction?', width / 2, height / 2 - 100);

    // Gold divider line
    stroke(casinoGold);
    strokeWeight(2);
    line(width / 2 - 300, height / 2 - 70, width / 2 + 300, height / 2 - 70);
    noStroke();

    // Player 1 label in blue
    fill(P1_COLOUR.r, P1_COLOUR.g, P1_COLOUR.b);
    textSize(22);
    text('Player 1', width / 2 - 85, height / 2 - 30);

    // Player 2 label in red
    fill(P2_COLOUR.r, P2_COLOUR.g, P2_COLOUR.b);
    text('Player 2', width / 2 + 85, height / 2 - 30);

    // Dash
    fill(casinoGold);
    textSize(48);
    text('—', width / 2, height / 2 + 25);

    // Error message
    if (errorMessage !== '') {
      fill(255, 80, 80);
      textSize(18);
      text(errorMessage, width / 2, height / 2 + 185);
    }

    return;
  }


  //
  else if (gameStatus === "cash bet") {

    let currentCash = cash;
    let sliderVal = betSlider ? Number(betSlider.value()) : 1;
    let winResult  = nf(currentCash + sliderVal, 1, 2);
    let loseResult = nf(currentCash - sliderVal, 1, 2);
    

    // Title
    fill(casinoGold);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont('monospace');
    textSize(38);
    text('How much do you want to bet?', width / 2, height / 2 - 130);

    // Gold divider line
    stroke(casinoGold);
    strokeWeight(2);
    line(width / 2 - 300, height / 2 - 100, width / 2 + 300, height / 2 - 100);
    noStroke();

    // Live bet amount display
    fill(255);
    textSize(46);
    text('$' + nf(sliderVal, 1, 2), width / 2, height / 2 - 10);

    // Win / loss preview
    fill(100, 220, 100);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('WIN  →  $' + winResult, width / 2 - 110, height / 2 + 75);

    fill(255, 80, 80);
    text('LOSE →  $' + loseResult, width / 2 + 110, height / 2 + 75);

    // Divider between win/loss
    stroke(60);
    strokeWeight(1);
    line(width / 2, height / 2 + 58, width / 2, height / 2 + 93);
    noStroke();

    return;
  }


  // ----- BATTLE SCREEN ----- \\
  else if (gameStatus === "battle") {
 
    noStroke();
    fill(PLATFORM.colour);
    rect(PLATFORM.x, PLATFORM.y, PLATFORM.width, PLATFORM.height);
  
    for (let someParticle of particleArray) {
      if (someParticle.isDead()) {
        let index = particleArray.indexOf(someParticle);
        particleArray.splice(index, 1);
      }
      someParticle.update();
      someParticle.display();
    }
  
    drawPlayer(p1, color(P1_COLOUR.r, P1_COLOUR.g, P1_COLOUR.b));
    drawPlayer(p2, color(P2_COLOUR.r, P2_COLOUR.g, P2_COLOUR.b));

    // Scoreboard
    fill(WHITE);
    noStroke();
    textAlign(CENTER, TOP);
    textSize(SCOREBOARD.size);
    textFont('monospace');
    fill(P1_COLOUR.r, P1_COLOUR.g, P1_COLOUR.b); text(score1, width / 2 - 40, SCOREBOARD.ypos);
    fill(SCOREBOARD.dash.colour);          text('   —   ',    width / 2,      SCOREBOARD.dash);
    fill(P2_COLOUR.r, P2_COLOUR.g, P2_COLOUR.b);  text(score2, width / 2 + 40, SCOREBOARD.ypos);

    // Bet display
    textAlign(RIGHT, TOP);
    fill(casinoGold);
    textSize(BET_PLACED_VALUE_DISPLAY.textSize);
    text('Bet: $' + betAmount, BET_PLACED_VALUE_DISPLAY.xpos, BET_PLACED_VALUE_DISPLAY.ypos);

    // Controls reminder
    textAlign(CENTER, BOTTOM);
    fill(KEY_MAPPING_TEXT.colour);
    textSize(KEY_MAPPING_TEXT.size);
    text('[LEFT SHIFT] Player 1      [ENTER] Player 2', width / 2, height - 15);
  
    updateGame();

    if (score1 === PLAYER_MAX_SCORE || score2 === PLAYER_MAX_SCORE) {
      resolveBet();
      score1 = RESTART_SCORE;
      score2 = RESTART_SCORE;
      particleArray = [];
      reset();
      gameStatus = "score prediction";
      setupPredictionScreen();
    }
  }
}