const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const soldierCount = document.querySelector('#soldier-count');
  soldierCount.innerText = remainingMilitaryCount;
};

const updateGameStage = function(currentStageNum) {
  const stages = { 1: 'Claim', 2: 'Reinforcement', 3: 'Final Stage' };
  const currentStage = document.querySelector('#stages');
  currentStage.innerText = stages[currentStageNum];
};

const updateGameView = function(gameStatus) {
  updateRemainingMilitaryCount(gameStatus.remainingMilitaryCount);
  updateGameStage(gameStatus.currentStage);
};

const sendSyncReq = function() {
  const reqOptions = { method: 'GET' };
  fetch('/gameStatus', reqOptions)
    .then(response => response.json())
    .then(updateGameView);
};
