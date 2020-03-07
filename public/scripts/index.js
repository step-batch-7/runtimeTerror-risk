const sendReinforcementRequest = function(country) {};

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
