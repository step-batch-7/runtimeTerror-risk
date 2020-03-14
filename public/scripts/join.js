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
  const postData = JSON.stringify(getInputValues());
  event.preventDefault();
  const callback = response => {
    if (response.joinStatus) {
      document.location = 'waiting.html';
      return;
    }
    renderErrorMsg(response.errorMsg);
  };
  sendPOSTRequest('/joinGame', postData, callback);
};

const main = function() {
  const $form = getElement('form');
  $form.addEventListener('submit', requestForJoinGame);
};

window.onload = main;
