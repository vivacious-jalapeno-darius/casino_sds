let homeButton;

function draw() {
  home(homeButton);
}

function home(button) {
  button = createButton('⌂');
  button.size(100);
  button.position(10, 10);
  button.style('background-color', casinoGold);
  button.style('font-size', '30px');
  button.mousePressed(folderTeleporter);
}


function folderTeleporter() {
  window.location.href = "../index.html";
}