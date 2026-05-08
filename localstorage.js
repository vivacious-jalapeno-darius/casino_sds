let cash;
let casinoRed;
let casinoGold;

function setup() {
  clearStorage('casino_cash');
  clearStorage('theme_red');
  clearStorage('theme_gold');

  cash = 100;
  casinoRed = "#B30000";
  casinoGold = "#EFBF04";
  
  storeItem('casino_cash', cash);
  storeItem('theme_red', casinoRed);
  storeItem('theme_gold', casinoGold);
}