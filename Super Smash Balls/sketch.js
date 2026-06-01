// Super Smash Balls
let cash;

function preload() {
  cash = Number(getItem('casino_cash'));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  console.log(cash);
}

function draw() {
  gameNotReady(); 
  platform();
}


// REMOVE WHEN DONE
function gameNotReady() {
  textSize(150);
  background(220);
  textAlign(CENTER, CENTER);
  text("UNDER CONSTRUCTION", width/2, height/2);
}
// -----------------------------------------------

function platform() {
  fill(0);
  rect(100, 700, 1700, 100);
}




