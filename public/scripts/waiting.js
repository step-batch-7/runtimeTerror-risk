const getPlayerColor = function(playerId) {
  const playerColors = [
    'indianred',
    'forestgreen',
    'mediumslateblue',
    'yellowgreen',
    'plum',
    'orange'
  ];
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

const showJoinedPlayersName = function(playersDetails) {
  const $waitingDetailsBox = document.querySelector('.box');
  const joinderPlayers = document.querySelectorAll('.player');
  joinderPlayers.forEach(player => player.parentElement.removeChild(player));
  for (let playerId in playersDetails) {
    const $nameBox = document.createElement('div');
    const $name = document.createElement('p');
    $name.innerHTML = playersDetails[playerId].name;
    $nameBox.appendChild($name);
    $nameBox.className = 'player';
    $nameBox.style.backgroundColor = getPlayerColor(playerId);
    $waitingDetailsBox.appendChild($nameBox);
  }
};

const showJoinedPlayers = function({ hasGameStarted, playersDetails }) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  $joinedPlayers.innerHTML = Object.keys(playersDetails).length;
  showJoinedPlayersName(playersDetails);
  if (hasGameStarted) {
    setTimeout(() => {
      document.location = 'game.html';
    }, 1000);
  }
};

const sendReqForPlayerDetails = function() {
  fetch('/playersDetails', { method: 'GET' })
    .then(response => response.json())
    .then(showJoinedPlayers);
};

const main = function() {
  sendReqForGameDetails();
  sendReqForPlayerDetails();
  setInterval(sendReqForPlayerDetails, 1000);
};

window.onload = main;
