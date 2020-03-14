const getPlayerId = () => document.cookie.match(/_playerId=([0-9]+)/)[1];

const getPlayerColor = function(playerId) {
  const playerColors = [
    '#EF9A9A',
    '#C5E1A5',
    '#FFCC80',
    '#C9B5E6',
    '#FFF59D',
    '#F5D9EC'
  ];
  return playerColors[playerId - 1];
};

const updateMilitaryCount = function(remainingMilitaryCount) {
  const $soldierCount = getElement('#soldier-count');
  if (+$soldierCount.children[0].innerText === remainingMilitaryCount) {
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
  Object.entries(territories).forEach(([territoryId, territory]) => {
    const { occupiedBy, militaryUnits } = territory;
    getElement(`#${territoryId}`).style.fill = getPlayerColor(occupiedBy);
    const $textElement = getElement(`#${territoryId} + .unit`);
    $textElement.innerHTML = `${militaryUnits}`.padStart(2, ' ');
  });
};

const showPhases = function(currentPhase, error, event) {
  if (error) {
    return mousePointerPopUp(event, error);
  }
  const phases = { 1: 'reinforcement', 2: 'attack', 3: 'fortify' };
  getElement('.phase-block').classList.remove('hide');
  const $previousPhase = getElement('.current-phase');
  $previousPhase && $previousPhase.classList.remove('current-phase');
  getElement(`.${phases[currentPhase]}`).classList.add('current-phase');
  localStorage.setItem('phase', currentPhase);
};

const updateGameStage = function(currentStage) {
  const stages = {
    1: 'Claim Stage',
    2: 'Reinforcement Stage',
    3: 'Playing Stage'
  };
  getElement('#stages span').innerText = `${stages[currentStage]}`;
  localStorage.setItem('stage', currentStage);
};

const updateActivities = function(activities) {
  const activityHTML = activities.map(({ msg }) => {
    return `<div class="activity-details">
    <span class="activity-message">${msg}</span>
    </div>`;
  });
  getElement('#activity-log').innerHTML = activityHTML.join('\n');
};

const highLightPlayer = function(playerId) {
  const $previousPlayer = getElement('.current-player');
  $previousPlayer && $previousPlayer.classList.remove('current-player');
  getElement(`[id="${playerId}"]`).classList.add('current-player');
};

const popUpForChoosingMilitaryCount = function(attackDetails) {
  console.log(attackDetails);
  console.log(document.cookie);
};

const notifyDefender = function(attackDetails) {
  if (localStorage.getItem('attackStatus')) {
    return;
  }
  localStorage.setItem('attackStatus', true);
  popUpForChoosingMilitaryCount(attackDetails);
};

const updateGameView = function(gameStatus) {
  updateGameStage(gameStatus.currentStage);
  updateMap(gameStatus.territories);
  updateActivities(gameStatus.activities);
  highLightPlayer(gameStatus.currentPlayer.id);
  if (+gameStatus.currentPlayer.id === +getPlayerId()) {
    updateMilitaryCount(gameStatus.currentPlayer.leftMilitaryCount);
  }
  gameStatus.currentStage === 3 && showPhases(gameStatus.currentPhase);
  if (!gameStatus.attackDetails) {
    return localStorage.setItem('attackStatus', false);
  }
  notifyDefender(gameStatus.attackDetails);
};

const sendSyncReq = function() {
  sendGETRequest('/gameStatus', updateGameView);
};
