let cash;
let casinoRed;
let casinoGold;

function setup() {
  clearStorage('theme_red');
  clearStorage('theme_gold');

  

  if (cash !== undefined) {
    cash = getItem('casino_cash');
  }
  else {
    cash === undefined;
  }
  cash = undefined;
  casinoRed = "#B30000";
  casinoGold = "#EFBF04";
  
  storeItem('casino_cash', cash);
  storeItem('theme_red', casinoRed);
  storeItem('theme_gold', casinoGold);
}