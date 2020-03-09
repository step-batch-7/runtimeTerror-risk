const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const soldierCount = getElement('#soldier-count');
  soldierCount.innerText = remainingMilitaryCount;
};

const updateMap = function(territories) {
  for (const territory in territories) {
    getElement(`#${territory}`).style.fill = territories[territory].occupiedBy;
    getElement(`#${territory} + .unit`).innerHTML = `&nbsp${territories[territory].militaryUnits}`;
  }
};

const updateGameStage = function(currentStageNum) {
  const stages = {
    1: 'Claim (1st Stage)',
    2: 'Reinforcement (2nd Stage)',
    3: 'Final (3rd Stage)'
  };
  const currentStage = getElement('#stages span');
  currentStage.innerText = `${stages[currentStageNum]}`;
  localStorage.setItem('stage', currentStageNum);
};

const updateActivities = function(activities) {
  const $activityLog = getElement('#activity-log');
  let activityHTML = '';
  activities.forEach(({ msg }) => {
    activityHTML += `<div class="activity-details">
                      <span class="activity-message">${msg}</span>
                    </div>`;
  });
  $activityLog.innerHTML = activityHTML;
};

const updateGameView = function(gameStatus) {
  updateRemainingMilitaryCount(gameStatus.currentPlayer.leftMilitaryCount);
  updateGameStage(gameStatus.currentStage);
  updateMap(gameStatus.territories);
  updateActivities(gameStatus.activities);
};

const sendSyncReq = function() {
  const reqOptions = { method: 'GET' };
  fetch('/gameStatus', reqOptions)
    .then(response => response.json())
    .then(updateGameView);
};
