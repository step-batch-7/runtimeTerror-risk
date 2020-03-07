const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const soldierCount = document.querySelector('#soldier-count');
  soldierCount.innerText = remainingMilitaryCount;
};

const updateGameStage = function(currentStageNum) {
  const stages = {
    1: 'Claim(1st)',
    2: 'Reinforcement(2nd)',
    3: 'Final(3rd)'
  };
  const currentStage = document.querySelector('#stages span');
  currentStage.innerText = `${stages[currentStageNum]} Stage`;
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
