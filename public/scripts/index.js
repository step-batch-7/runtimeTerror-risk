const updatePhase = function(event) {
  sendGETRequest('/updatePhase', ({ currentPhase, error }) =>
    showPhases(currentPhase, error, event)
  );
};

const mousePointerPopUp = function(event, msg) {
  const $mousePopUp = getElement('#mouse-pop-up');
  $mousePopUp.classList.remove('hidden');
  $mousePopUp.innerText = msg;
  $mousePopUp.style.top = `${event.clientY + 20}px`;
  $mousePopUp.style.left = `${event.clientX}px`;
  setTimeout(() => {
    $mousePopUp.classList.add('hidden');
  }, 1500);
};

const showReinforcementStatus = function(response, event) {
  const { leftMilitaryCount, territoryMilitaryCount, error } = response;
  if (!response.isDone) {
    return mousePointerPopUp(event, error);
  }
  const $textElement = getElement(`#${event.target.id} + .unit`);
  $textElement.innerHTML = `${territoryMilitaryCount}`.padStart(2, ' ');
  updateMilitaryCount(leftMilitaryCount);
};

const sendReinforcementRequest = function(event, militaryCount = 1) {
  const postData = JSON.stringify({
    territory: event.target.id,
    militaryCount
  });
  const callback = response => showReinforcementStatus(response, event);
  sendPOSTRequest('/reinforcement', postData, callback);
};

const updateTerritory = function(response, event) {
  if (!response.isDone) {
    return mousePointerPopUp(event, response.error);
  }
  event.target.style.fill = getPlayerColor(getPlayerId());
  getElement(`#${event.target.id} + .unit`).innerHTML = ' 1';
  updateMilitaryCount(response.leftMilitaryCount);
};

const sendClaimRequest = function(event) {
  const postData = JSON.stringify({ territory: event.target.id });
  const callback = response => updateTerritory(response, event);
  sendPOSTRequest('/performClaim', postData, callback);
};

const getPlayerNameTemplate = function([playerId, player]) {
  const playerColor = getPlayerColor(playerId);
  return `<div class="player" id="${playerId}">
            <span>${player.name}</span>
            <div style="background-color: ${playerColor};" class="color-box"></div>
          </div>`;
};

const displayPlayersDetails = function({ playersDetails }) {
  const myPlayer = playersDetails[getPlayerId()];
  getElement('.player-name').innerText = myPlayer.name;
  getElement('.front').innerText = myPlayer.leftMilitaryCount;
  const templates = Object.entries(playersDetails).map(getPlayerNameTemplate);
  getElement('.players').innerHTML = templates.join('');
};

const getPlayersDetails = function() {
  sendGETRequest('/playersDetails', displayPlayersDetails);
};

const sendAttackRequest = function (event) {
  
};

const selectListenerForPlayStage = function() {
  const listeners = {
    1: () => {},
    2: sendAttackRequest,
    3: () => {}
  };
  const phase = localStorage.getItem('phase');
  listeners[phase](event);
};

const selectListener = function() {
  const listeners = {
    1: sendClaimRequest,
    2: sendReinforcementRequest,
    3: selectListenerForPlayStage
  };
  const stage = localStorage.getItem('stage');
  listeners[stage](event);
};

const attachListenerToTerritories = () => {
  const countries = Array.from(document.querySelectorAll('.area'));
  countries.forEach(territory => {
    territory.addEventListener('click', selectListener);
  });
};

const main = function() {
  renderMap();
  getPlayersDetails();
  attachListenerToTerritories();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
