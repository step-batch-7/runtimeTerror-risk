const getTerritory = id => document.querySelector(`#${id}`);
const getTerritories = () => Array.from(document.querySelectorAll('.area'));

const range = function(start, end) {
  if (start === end) return [start];
  if (start < end) return [start, ...range(start + 1, end)];
  return [start, ...range(start - 1, end)];
};

const askMilitaryCount = (event, maxCount, callback) => {
  const optionsHtml = range(1, maxCount)
    .map(option => {
      return `<option value="${option}">${option}</option>`;
    })
    .join('\n');
  const $selectionPopUp = getElement('.military-unit-pop-up');
  $selectionPopUp.children[1].innerHTML = optionsHtml;
  $selectionPopUp.children[2].onclick = () => {
    $selectionPopUp.classList.add('hidden');
    callback(+getElement('#militaryUnit').value);
  };
  $selectionPopUp.style.top = `${event.clientY + 20}px`;
  $selectionPopUp.style.left = `${event.clientX}px`;
  $selectionPopUp.classList.remove('hidden');
  console.log(getElement('#militaryUnit').value);
};

const makeTerritoriesInteractive = (territories, listener) => {
  territories.forEach(territory => {
    territory.onclick = listener;
    territory.classList.add('highlight');
  });
};

const makeTerritoriesNonInteractive = territories => {
  territories.forEach(territory => {
    territory.onclick = () => {};
    territory.classList.remove('highlight');
  });
};

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
  const { leftMilitary, territoryMilitaryCount, error } = response;
  if (!response.isDone) {
    return mousePointerPopUp(event, error);
  }
  const $textElement = getElement(`#${event.target.id} + .unit`);
  $textElement.innerHTML = `${territoryMilitaryCount}`.padStart(2, ' ');
  updateMilitaryCount(leftMilitary);
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

const sendAttackRequest = function(event) {};

const fortify = (selectedTerritoryId, maxCount, event) => {
  const targetTerritoryId = event.target.id;
  askMilitaryCount(event, maxCount, selectedCount => {
    const fortifyData = {
      selectedTerritoryId,
      targetTerritoryId,
      militaryUnits: selectedCount
    };
    sendPOSTRequest('/fortify', JSON.stringify(fortifyData), fortifyStatus => {
      if (!fortifyStatus.isDone) return;
      const {
        selectedTerritoryMilitary,
        targetTerritoryMilitary
      } = fortifyStatus;
      document.querySelector(
        `#${selectedTerritoryId} + .unit`
      ).innerHTML = `${selectedTerritoryMilitary}`.padStart(2, ' ');
      document.querySelector(
        `#${targetTerritoryId} + .unit`
      ).innerHTML = `${targetTerritoryMilitary}`.padStart(2, ' ');
      makeTerritoriesNonInteractive(getTerritories());
      makeTerritoriesInteractive(getTerritories(), selectListener);
    });
  });
};

const initiateFortify = function(event) {
  makeTerritoriesNonInteractive(getTerritories());
  const selectedTerritoryId = event.target.id;
  sendPOSTRequest(
    '/initiateFortify',
    JSON.stringify({ selectedTerritoryId }),
    fortifyStatus => {
      if (!fortifyStatus.isAccepted) {
        mousePointerPopUp(event, fortifyStatus.error);
        return makeTerritoriesInteractive(getTerritories(), selectListener);
      }
      const { validTerritoryIds, maxValidMilitaryUnits } = fortifyStatus;
      const validTerritories = validTerritoryIds.map(getTerritory);
      makeTerritoriesInteractive(
        validTerritories,
        fortify.bind(null, selectedTerritoryId, maxValidMilitaryUnits)
      );
    }
  );
};

const selectListenerForPlayStage = function(event) {
  const listeners = {
    1: () => {},
    2: sendAttackRequest,
    3: initiateFortify
  };
  const phase = localStorage.getItem('phase');
  listeners[phase](event);
};

const selectListener = function(event) {
  const listeners = {
    1: sendClaimRequest,
    2: sendReinforcementRequest,
    3: selectListenerForPlayStage
  };
  const stage = localStorage.getItem('stage');
  listeners[stage](event);
};

const main = function() {
  renderMap();
  getPlayersDetails();
  makeTerritoriesInteractive(getTerritories(), selectListener);
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
