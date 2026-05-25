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
  background(220);
  textAlign(CENTER, CENTER);
  text("testing 1267", width/2, height/2);
}
