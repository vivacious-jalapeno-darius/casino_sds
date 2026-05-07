// Roulette

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

let tableBrown = '#5b3c1f';


// let rlabel = 1.1;

let gameStatus = "start";

let pointer;






function setup() {
  createCanvas(windowWidth, windowHeight);

  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

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
  else if (gameStatus === "gamble") {
    betInput.hide();
    amountOfSections.hide();
    background(tableBrown);
    translate(width/2, height/2);
    
    pieChart(0, 0, 350, sections);
    createPointer(0, 0, backgroundCircleDiameter, 20, 40);
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

  textSize(50);
  fill(textColour);
  text("# of sections", width*(3/4), height*(3/5));
}



function input() {
  betInput = createInput();
  betInput.size(200, 50);
  betInput.position(width*(3/4) - 100, height*(2/5) - 25); 

  amountOfSections = createInput();
  amountOfSections.size(200, 50);
  amountOfSections.position(width*(3/4) - 100, height*(7/10) - 25); 
}




function pieChart(xCenter, yCenter, diameter, data) {
  let lastAngle = 0;
  fill(rouletteBlack);
  circle(xCenter, yCenter, backgroundCircleDiameter);
  for (let i = 0; i < data; i++) {
    push();
    
    rotate(angleRotation);
    
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


    pop();

    angleRotation += 0.02;
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