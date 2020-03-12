const updatePhase = function(event) {
  fetch('/updatePhase', {method: 'GET'})
    .then(response => response.json())
    .then(({currentPhase, error}) => showPhases(currentPhase, error, event));
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
  const {leftMilitaryCount, territoryMilitaryCount, error} = response;
  if (response.isDone) {
    const $textElement = getElement(`#${event.target.id} + .unit`);
    $textElement.innerHTML = `${territoryMilitaryCount}`.padStart(2, ' ');
    return updateMilitaryCount(leftMilitaryCount);
  }
  mousePointerPopUp(event, error);
};

const sendReinforcementRequest = function(event, militaryCount = 1) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({territory: event.target.id, militaryCount})
  };
  fetch('/reinforcement', requestOptions)
    .then(response => response.json())
    .then(response => showReinforcementStatus(response, event));
};

const updateTerritory = function(response, event) {
  if (response.isDone) {
    event.target.style.fill = getPlayerColor(getPlayerId());
    getElement(`#${event.target.id} + .unit`).innerHTML = '1'.padStart(2, ' ');
    updateMilitaryCount(response.leftMilitaryCount);
    return;
  }
  mousePointerPopUp(event, response.error);
};

const sendClaimRequest = function(event) {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({territory: event.target.id})
  };
  fetch('/performClaim', requestOptions)
    .then(response => response.json())
    .then(data => updateTerritory(data, event));
};

const showPlayer = function(playerId, name) {
  const playerColor = getPlayerColor(playerId);
  return `<div class="player" id="${playerId}">
            <span>${name}</span>
            <div style="background-color: ${playerColor};" class="color-box"></div>
          </div>`;
};

const displayPlayerDetails = function({playersDetails}) {
  const myPlayer = playersDetails[getPlayerId()];
  getElement('.player-name').innerText = myPlayer.name;
  getElement('.front').innerText = myPlayer.leftMilitaryCount;
  let htmlTemplate = '';
  for (const playerId in playersDetails) {
    htmlTemplate += showPlayer(playerId, playersDetails[playerId].name);
  }
  getElement('.players').innerHTML = htmlTemplate;
};

const getPlayerDetails = function() {
  fetch('/playersDetails', {method: 'GET'})
    .then(response => response.json())
    .then(displayPlayerDetails);
};

const selectListener = function() {
  const listeners = {'1': sendClaimRequest, '2': sendReinforcementRequest};
  const stage = localStorage.getItem('stage');
  listeners[stage](event);
};

const addListenerOnTerritory = () => {
  const countries = Array.from(document.querySelectorAll('.area'));
  countries.forEach(territory => {
    territory.addEventListener('click', selectListener);
  });
};

const main = function() {
  renderMap();
  getPlayerDetails();
  addListenerOnTerritory();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
