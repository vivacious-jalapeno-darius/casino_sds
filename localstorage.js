let cash;
let casinoRed;
let casinoGold;

function preload() {
  cash = Number(getItem('casino_cash'));
}


function setup() {
  clearStorage('theme_red');
  clearStorage('theme_gold');
  

  

  if (cash === undefined || cash === null) {
    cash = 100;
  }
  casinoRed = "#B30000";
  casinoGold = "#EFBF04";
  
  storeItem('casino_cash', cash);
  storeItem('theme_red', casinoRed);
  storeItem('theme_gold', casinoGold);


  let rouletteButton = select('#roulette-btn');

  if (rouletteButton) {
    rouletteButton.mousePressed(function(event) {
      if (cash <= 0) {
        alert("You are too POOR to play Roulette");

      }
    });
  }
}