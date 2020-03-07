const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const soldierCount = document.querySelector('#soldier-count');
  soldierCount.innerText = remainingMilitaryCount;
};

const updateGameView = function(gameStatus) {
  updateRemainingMilitaryCount(gameStatus.remainingMilitaryCount);
};

const sendSyncReq = function() {
  const reqOptions = { method: 'GET' };
  fetch('/gameStatus', reqOptions)
    .then(response => response.json())
    .then(updateGameView);
};
