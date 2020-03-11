const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const playerName = getElement('#playerName').value;
  const gameId = getElement('#gameId').value;
  return {playerName, gameId};
};

const renderErrorMsg = function(errorMsg) {
  const $errorMsg = getElement('#error-msg');
  $errorMsg.innerHTML = `<div class="error-msg">${errorMsg}</div>`;
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
