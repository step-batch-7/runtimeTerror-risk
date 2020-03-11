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
    getElement(
      `#${event.target.id} + .unit`
    ).innerHTML = `&nbsp;${territoryMilitaryCount}`;
    updateRemainingMilitaryCount(leftMilitaryCount);
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
    getElement(`#${event.target.id}`).style.fill = response.color;
    getElement(`#${event.target.id} + .unit`).innerHTML = '&nbsp;1';
    updateRemainingMilitaryCount(response.leftMilitaryCount);
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

const showPlayer = function(player) {
  return `<div class="player" id="${player.color}">
            <span>${player.name}</span>
            <div style="background-color: ${player.color};" class="color-box"></div>
          </div>`;
};

const displayPlayerDetails = function({ playerList, player }) {
  getElement('.player-name').innerText = player.name;
  getElement('.front').innerText = player.leftMilitaryCount;
  const htmlTemplate = playerList.map(showPlayer);
  const $players = getElement('.players');
  $players.innerHTML = htmlTemplate.join('\n');
  localStorage.setItem('myId', player.color);
};

const getPlayerDetails = function() {
  fetch('/playerList', { method: 'GET' })
    .then(response => response.json())
    .then(displayPlayerDetails);
};

const selectListener = function() {
  const listeners = { '1': sendClaimRequest, '2': sendReinforcementRequest };
  const stage = localStorage.getItem('stage');
  listeners[stage](event);
};

const addListenerOnterritory = () => {
  const countries = Array.from(document.querySelectorAll('.area'));
  countries.forEach(territory => {
    territory.addEventListener('click', selectListener);
  });
};

const main = function() {
  renderMap();
  getPlayerDetails();
  addListenerOnterritory();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
