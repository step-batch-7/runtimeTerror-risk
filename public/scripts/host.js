const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const $playerName = getElement('#playerName');
  const $playerCount = getElement('#playerCount');
  const playerName = $playerName.value;
  const numOfPlayers = $playerCount.value;
  $playerName.value = '';
  $playerCount.value = '';
  return {playerName, numOfPlayers};
};

const requestForHostGame = function(event) {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(getInputValues())
  };
  event.preventDefault();
  fetch('/hostGame', options)
    .then(res => res.json())
    .then(() => {
      document.location = `waiting.html`;
    });
};

const main = function() {
  const $form = getElement('form');
  $form.addEventListener('submit', requestForHostGame);
};

window.onload = main;
