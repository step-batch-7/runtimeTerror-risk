const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const element = document.querySelector('.front');
  const parentElement = element.parentElement;
  if (parentElement.style.transform === 'rotateY(180deg)') {
    parentElement.style.transform = 'rotateY(0deg)';
    element.innerText = remainingMilitaryCount;
    return;
  }
  document.querySelector('.back').innerText = remainingMilitaryCount;
  parentElement.style.transform = 'rotateY(180deg)';
};

const updateMap = function(territories) {
  for (const territory in territories) {
    getElement(`#${territory}`).style.fill = territories[territory].occupiedBy;
    getElement(
      `#${territory} + .unit`
    ).innerHTML = `&nbsp${territories[territory].militaryUnits}`;
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
