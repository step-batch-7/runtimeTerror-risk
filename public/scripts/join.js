const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const $playerName = getElement('#playerName');
  const $gameId = getElement('#gameId');
  const playerName = $playerName.value;
  const gameId = $gameId.value;
  $playerName.value = '';
  $gameId.value = '';
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
