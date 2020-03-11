const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const playerName = getElement('#playerName').value;
  const gameId = getElement('#gameId').value;
  const $box = getElement('.box');
  $box.classList.add('hidden');
  return {playerName, gameId};
};

const renderErrorMsg = function(errorMsg) {
  getElement('#error-msg').innerText = errorMsg;
};

const requestForJoinGame = function(event) {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(getInputValues())
  };
  event.preventDefault();
  fetch('/joinGame', options)
    .then(res => res.json())
    .then(data => {
      if (data.joinStatus) {
        document.location = 'waiting.html';
        return;
      }
      renderErrorMsg(data.errorMsg);
    });
};

const main = function() {
  const $form = getElement('form');
  $form.addEventListener('submit', requestForJoinGame);
};

window.onload = main;
