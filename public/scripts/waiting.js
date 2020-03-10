const showGameDetails = function(response) {
  const $gameId = document.querySelector('#gameId');
  const $totalPlayers = document.querySelector('#totalPlayers');
  const {gameId, numOfPlayers} = response;
  $gameId.innerHTML = gameId;
  $totalPlayers.innerHTML = numOfPlayers;
};

const sendReqForGameDetails = function() {
  fetch('gameDetails', {method: 'GET'})
    .then(response => response.json())
    .then(showGameDetails);
};

const showJoinedPlayers = function(response) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  const {numOfJoinedPlayers, isAllPlayersJoined} = response;
  $joinedPlayers.innerHTML = numOfJoinedPlayers;
  if (isAllPlayersJoined) {
    document.location = 'game.html';
  }
};

const sendSyncReq = function() {
  fetch('waitingStatus', {method: 'GET'})
    .then(response => response.json())
    .then(showJoinedPlayers);
};

const main = function() {
  sendSyncReq();
  sendReqForGameDetails();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
