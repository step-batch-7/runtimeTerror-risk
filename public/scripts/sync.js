const updateRemainingMilitaryCount = function(remainingMilitaryCount) {
  const $soldierCount = getElement('#soldier-count');
  if ($soldierCount.children[0].innerText == remainingMilitaryCount) {
    return;
  }
  $soldierCount.children[0].innerText = remainingMilitaryCount;
  $soldierCount.classList.remove('rotate');
  $soldierCount.offsetWidth = $soldierCount.offsetWidth;
  $soldierCount.classList.add('rotate');
  setTimeout(() => {
    $soldierCount.children[1].innerText = remainingMilitaryCount;
  }, 100);
};

const updateMap = function(territories) {
  for (const territory in territories) {
    getElement(`#${territory}`).style.fill = territories[territory].occupiedBy;
    getElement(`#${territory} + .unit`).innerHTML = `&nbsp${territories[territory].militaryUnits}`;
  }
};

const showPhases = function(currentPhase) {
  const phases = { 1: 'reinforcement', 2: 'attack', 3: 'fortify' };
  localStorage.setItem('phase', currentPhase);
  const $phaseBox = getElement('.phase-block');
  $phaseBox.style.transform = 'scale(1)';
  const $phase = getElement(`.${phases[currentPhase]}`);
  $phase.classList.add('current-phase');
};

const updateGameStage = function({ currentStage, currentPhase }) {
  const stages = {
    1: 'Claim Stage',
    2: 'Reinforcement Stage',
    3: 'Playing Stage'
  };
  const $currentStage = getElement('#stages span');
  $currentStage.innerText = `${stages[currentStage]}`;
  localStorage.setItem('stage', currentStage);
  currentStage === 3 && showPhases(currentPhase);
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

const highLightCurrentPlayer = function(currentPlayer) {
  const $previousPlayer = getElement('.current-player');
  if ($previousPlayer) {
    $previousPlayer.classList.remove('current-player');
  }
  const $currentPlayerName = getElement(`#${currentPlayer.color}`);
  $currentPlayerName.classList.add('current-player');
};

const updateGameView = function(gameStatus) {
  const myId = localStorage.getItem('myId');
  updateGameStage(gameStatus);
  updateMap(gameStatus.territories);
  updateActivities(gameStatus.activities);
  highLightCurrentPlayer(gameStatus.currentPlayer);
  if (gameStatus.currentPlayer.color == myId) {
    updateRemainingMilitaryCount(gameStatus.currentPlayer.leftMilitaryCount);
  }
};

const sendSyncReq = function() {
  const reqOptions = { method: 'GET' };
  fetch('/gameStatus', reqOptions)
    .then(response => response.json())
    .then(updateGameView);
};
