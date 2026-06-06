let backgroundMusic;


function preload() {
  backgroundMusic = loadSound('background_music.mp3');
}

function setup() {
  backgroundMusic.loop();
}