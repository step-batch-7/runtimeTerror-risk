const getPlayerColor = function(playerId) {
  playerColors = ['indianred', 'forestgreen', 'mediumslateblue', 'yellowgreen', 'plum', 'orange'];
  return playerColors[playerId - 1];
};

const showGameDetails = function(response) {
  const $gameId = document.querySelector('#gameId');
  const $totalPlayers = document.querySelector('#totalPlayers');
  const { gameId, numOfPlayers } = response;
  $gameId.innerHTML = gameId;
  $totalPlayers.innerHTML = numOfPlayers;
};

const sendReqForGameDetails = function() {
  fetch('gameDetails', { method: 'GET' })
    .then(response => response.json())
    .then(showGameDetails);
};

const showJoinedPlayersName = function(playerDetails) {
  const $waitingDetailsBox = document.querySelector('.box');
  const joinderPlayers = document.querySelectorAll('.player');
  joinderPlayers.forEach(player => player.parentElement.removeChild(player));
  for (let playerId in playerDetails) {
    const $nameBox = document.createElement('div');
    const $name = document.createElement('p');
    $name.innerHTML = playerDetails[playerId].name;
    $nameBox.appendChild($name);
    $nameBox.className = 'player';
    $nameBox.style.backgroundColor = getPlayerColor(playerId);
    $waitingDetailsBox.appendChild($nameBox);
  }
};

const showJoinedPlayers = function({ isAllPlayersJoined, playerDetails }) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  $joinedPlayers.innerHTML = Object.keys(playerDetails).length;
  showJoinedPlayersName(playerDetails);
  if (isAllPlayersJoined) {
    setTimeout(() => {
      document.location = 'game.html';
    }, 1000);
  }
};

const sendSyncReq = function() {
  fetch('waitingStatus', { method: 'GET' })
    .then(response => response.json())
    .then(showJoinedPlayers);
};

const main = function() {
  sendReqForGameDetails();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
