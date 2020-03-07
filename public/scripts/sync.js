const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const soldierCount = document.querySelector('#soldier-count');
  soldierCount.innerText = remainingMilitaryCount;
};

const updateGameStage = function(currentStageNum) {
  const stages = {
    1: 'Claim (1st Stage)',
    2: 'Reinforcement (2nd Stage)',
    3: 'Final (3rd Stage)'
  };
  const currentStage = document.querySelector('#stages span');
  currentStage.innerText = `${stages[currentStageNum]}`;
  localStorage.setItem('stage', currentStageNum);
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
