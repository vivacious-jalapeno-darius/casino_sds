let homeButton;

function draw() {
  home(homeButton);
  if (gameStatus === "lose") {
    homeButton.hide();
  }
  else {
    homeButton.show();
  }
}

function home(button) {
  textSize(300);
  button = createButton('⌂');
  button.size(220);
  button.position(10, 10);
  button.style('background-color', casinoGold);
  button.style('font-size', '20px');
  button.mousePressed(folderTeleporter);
}


function folderTeleporter() {
  window.location.href = "../index.html";
}