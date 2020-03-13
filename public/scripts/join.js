const getElement = selector => document.querySelector(selector);

const getInputValues = function() {
  const playerName = getElement('#playerName').value;
  const gameId = getElement('#gameId').value;
  return { playerName, gameId };
};

const renderErrorMsg = function(errorMsg) {
  const $errorMsg = getElement('#error-msg');
  $errorMsg.innerHTML = `<div class="error-msg">${errorMsg}</div>`;
};

const requestForJoinGame = function(event) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getInputValues())
  };
  event.preventDefault();
  const callback = response => {
    if (response.joinStatus) {
      return (document.location = 'waiting.html');
    }
    renderErrorMsg(response.errorMsg);
  };

  sendPOSTRequest('/joinGame', options, callback);
};

const main = function() {
  const $form = getElement('form');
  $form.addEventListener('submit', requestForJoinGame);
};

window.onload = main;
