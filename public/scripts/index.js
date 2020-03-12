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
  const { status, leftMilitaryCount, territoryMilitaryCount, error } = response;
  if (status) {
    getElement(`#${event.target.id} + .unit`).innerHTML = `&nbsp;${territoryMilitaryCount}`;
    updateMilitaryCount(leftMilitaryCount);
    return;
  }
  mousePointerPopUp(event, error);
};

const sendReinforcementRequest = function(event, militaryCount = 1) {
  fetch('/reinforcement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ territory: event.target.id, militaryCount })
  })
    .then(response => response.json())
    .then(response => showReinforcementStatus(response, event));
};

const updateTerritory = function(response, event) {
  if (response.status) {
    event.target.style.fill = getPlayerColor(getPlayerId());
    getElement(`#${event.target.id} + .unit`).innerHTML = '&nbsp;1';
    updateMilitaryCount(response.leftMilitaryCount);
    return;
  }
  mousePointerPopUp(event, response.error);
};

const sendClaimRequest = function(event) {
  fetch('/performClaim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ territory: event.target.id })
  })
    .then(response => response.json())
    .then(data => updateTerritory(data, event));
};

const showPlayer = function(playerId, name) {
  return `<div class="player" id="${playerId}">
            <span>${name}</span>
            <div style="background-color: ${getPlayerColor(playerId)};" class="color-box"></div>
          </div>`;
};

const displayPlayerDetails = function({ playersDetails }) {
  const myPlayer = playersDetails[getPlayerId()];
  getElement('.player-name').innerText = myPlayer.name;
  getElement('.front').innerText = myPlayer.leftMilitaryCount;
  let htmlTemplate = '';
  for (let playerId in playersDetails) {
    htmlTemplate += showPlayer(playerId, playersDetails[playerId].name);
  }
  getElement('.players').innerHTML = htmlTemplate;
};

const getPlayerDetails = function() {
  fetch('/playersDetails', { method: 'GET' })
    .then(response => response.json())
    .then(displayPlayerDetails);
};

const selectListener = function() {
  const listeners = { '1': sendClaimRequest, '2': sendReinforcementRequest };
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
