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

const showReinforcementStatus = function({ status, message }) {
  if (!status && message) {
    return;
  }
};

const sendReinforcementRequest = function(event, militaryCount = 1) {
  fetch('/reinforcement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ territory: event.target.id, militaryCount })
  })
    .then(response => response.json())
    .then(showReinforcementStatus);
};

const updateTerritory = function(response, event) {
  if (response.status) {
    getElement(`#${event.target.id}`).style.fill = 'red';
    getElement(`#${event.target.id} + .unit`).innerHTML = '&nbsp;1';
    return;
  }
  mousePointerPopUp(event, response.error);
};

const sendClaimRequest = function(event) {
  fetch('/claimTerritory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ territory: event.target.id })
  })
    .then(response => response.json())
    .then(data => updateTerritory(data, event));
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
  addListenerOnterritory();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
