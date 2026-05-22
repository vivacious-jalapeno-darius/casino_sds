let map;

let mapMinimizedWidth;
let mapMinimizedHeight;
let mapMinimizedxpos;
let mapMinimizedypos;


function preload() {
  map = loadImage('map.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  
  
}

function draw() {
  mapMinimizedWidth = width*(1/6);
  mapMinimizedHeight = mapMinimizedWidth;
  mapMinimizedxpos = width-mapMinimizedWidth;
  mapMinimizedypos = height-mapMinimizedHeight;

  image(map, mapMinimizedxpos, mapMinimizedypos, mapMinimizedWidth, mapMinimizedHeight);

}