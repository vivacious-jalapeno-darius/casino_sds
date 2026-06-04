const PLATFORM = {
  x: 0,      
  y: 0,      
  width: 700, 
  height: 15
};

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


const PLAYER_RADIUS = 20;
let GROUND;

let particleArray = [];
const NUMBER_OF_PARTICLES = 50;

let casinoRed;
let casinoGold;

let p1;
let p2; 
let score1;
let score2; 

// --- Firework Particle Logic ---
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
 
function setup() {
  casinoRed = getItem('theme_red');
  casinoGold = getItem('theme_gold');

  createCanvas(windowWidth, windowHeight);
  home(homeButton);
  
  PLATFORM.x = (windowWidth - PLATFORM.width) / 2;
  PLATFORM.y = windowHeight * 0.80; 
  GROUND = PLATFORM.y - PLAYER_RADIUS;
  
  score1 = 0;
  score2 = 0;
  reset();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  PLATFORM.x = (windowWidth - PLATFORM.width) / 2;
  PLATFORM.y = windowHeight * 0.70;
  GROUND = PLATFORM.y - PLAYER_RADIUS;
}
 
function keyPressed() {
  // [F] P1
  if (keyCode === 70) { 
    p1.dx += 1.8; 
    p1.bump = 6; 
  } 
  
  // [J] P2
  if (keyCode === 74) { 
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
 
  for (let p of [p1, p2]) {
    if (!p.grounded) { 
      p.dy += 0.5; 
      p.y += p.dy; 
      p.rotation += p.dx / PLAYER_RADIUS; 
    }
    if (p.bump > 0) {
      p.bump--;
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
 
function drawPlayer(p, col) {
  push();
  translate(p.x, p.y);
  rotate(p.rotation);
  
  let s = p.bump > 0 ? 1.2 : 1;
  scale(s, s);
  
  fill(col);
  noStroke();
  circle(0, 0, PLAYER_RADIUS * 2);
  
  
  noStroke();
  fill(0);
  circle(p.eyes, -4, 6);
  
  pop();
}
 
function draw() {
  background(0);
 
  fill(67); // Great shade of grey, TRUST
  noStroke();
  rect(PLATFORM.x, PLATFORM.y, PLATFORM.width, PLATFORM.height);
  fill(100);
  rect(PLATFORM.x, PLATFORM.y, PLATFORM.width, 3);
 
  for (let someFirework of particleArray) {
    if (someFirework.isDead()) {
      let index = particleArray.indexOf(someFirework);
      particleArray.splice(index, 1);
    }
    someFirework.update();
    someFirework.display();
  }
 
  drawPlayer(p1, color(68, 170, 255));
  drawPlayer(p2, color(255, 85, 85));

  fill(255);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(40);
  textFont('monospace');
  fill(68, 170, 255); text(score1, width / 2 - 30, 28);
  fill(150);          text(' — ',    width / 2,      28);
  fill(255, 85, 85);  text(score2, width / 2 + 30, 28);
 

  textAlign(CENTER, BOTTOM);
  fill(167);
  textSize(30);
  text('[F] Player 1      [J] Player 2', width / 2, height - 15);
 
  updateGame();
}