const showReinforcementStatus = function({ status, message }) {
  if (!status && message) {
    return;
  }
};

const sendReinforcementRequest = function(territory, militaryCount = 1) {
  fetch('/reinforcement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ territory, militaryCount })
  })
    .then(response => response.json())
    .then(showReinforcementStatus);
};

const updateTerritory = function(response, territory) {
  if (response.status) {
    getElement(`#${territory}`).style.fill = 'red';
    getElement(`#${territory} + .unit`).innerHTML = '&nbsp;1';
  }
};

const sendClaimRequest = function(territory) {
  fetch('/claimTerritory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ territory })
  })
    .then(response => response.json())
    .then(data => updateTerritory(data, territory));
};

const selectListener = function() {
  const listeners = { '1': sendClaimRequest, '2': sendReinforcementRequest };
  const stage = localStorage.getItem('stage');
  listeners[stage](event.target.id);
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
