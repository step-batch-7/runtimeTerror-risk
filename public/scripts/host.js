const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const playerName = getElement('#playerName').value;
  const numOfPlayers = getElement('#playerCount').value;
  const $box = getElement('.box');
  $box.classList.add('hidden');
  return { playerName, numOfPlayers };
};

const requestForHostGame = function(event) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getInputValues())
  };
  event.preventDefault();
  fetch('/hostGame', options).then(res => {
    res.ok && (document.location = 'waiting.html');
  });
};

const main = function() {
  const $form = getElement('form');
  $form.addEventListener('submit', requestForHostGame);
};

window.onload = main;
