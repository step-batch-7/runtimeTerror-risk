const showReinforcementStatus = function({ status, message }) {
  if (!status && message) {
    return;
  }
};

const sendReinforcementRequest = function(country, militaryCount = 1) {
  fetch('/reinforcement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ country, militaryCount })
  })
    .then(response => response.json())
    .then(showReinforcementStatus);
};

const sendClaimRequest = function(country) {};

const selectListener = function() {
  const listeners = { '1': sendClaimRequest, '2': sendReinforcementRequest };
  const stage = localStorage.getItem('stage');
  listeners[stage](event.target.id);
};

const addListenerOnCountry = () => {
  const countries = Array.from(document.querySelectorAll('.area'));
  countries.forEach(country => {
    country.addEventListener('click', selectListener);
  });
};

const main = function() {
  renderMap();
  addListenerOnCountry();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
