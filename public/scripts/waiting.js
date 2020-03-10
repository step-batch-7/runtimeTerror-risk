const showGameDetails = function(response) {
  const $gameId = document.querySelector('#gameId');
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  const {gameId, numOfPlayers} = response;

  $gameId.innerHTML = gameId;
  $joinedPlayers.innerHTML = `0/${numOfPlayers}`;
};

const sendReqForGameDetails = function() {
  fetch('gameDetails', {method: 'GET'})
    .then(response => response.json())
    .then(showGameDetails);
};

const sendSyncReq = function() {
  return 0;
};

const main = function() {
  sendSyncReq();
  sendReqForGameDetails();
};

window.onload = main;
