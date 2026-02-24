let smartcoins = 0;

export function addCoins(amount) {
  smartcoins += amount;
  localStorage.setItem('smartcoins', smartcoins);
}

export function getCoins() {
  return parseInt(localStorage.getItem('smartcoins') || '0', 10);
}