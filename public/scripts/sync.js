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

const updateGameStage = function(currentStageNum) {
  const stages = {
    1: 'Claim Stage',
    2: 'Reinforcement Stage',
    3: 'Playing Stage'
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

const showPlayer = function(player, currentPlayer) {
  const className = player == currentPlayer ? 'current-player' : '';
  return `<div class="player ${className}" id>
            <span>${player.name}</span>
            <div style="background-color: ${player.color};" class="color-box"></div>
          </div>`;
};

const updatePlayerList = function(playerList, currentPlayer) {
  const htmlTemplate = playerList.map(player => showPlayer(player, currentPlayer));
  const $players = getElement('.players');
  $players.innerHTML = htmlTemplate.join('\n');
};

const updateGameView = function(gameStatus) {
  updateGameStage(gameStatus.currentStage);
  updateMap(gameStatus.territories);
  updateActivities(gameStatus.activities);
  updateRemainingMilitaryCount(gameStatus.currentPlayer.leftMilitaryCount);
  updatePlayerList(gameStatus.playerNames, gameStatus.currentPlayer);
};

const sendSyncReq = function() {
  const reqOptions = { method: 'GET' };
  fetch('/gameStatus', reqOptions)
    .then(response => response.json())
    .then(updateGameView);
};
