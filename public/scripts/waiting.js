const getPlayerColor = function(playerId) {
  const playerColors = [
    '#EF9A9A',
    '#C5E1A5',
    '#FFCC80',
    '#C9B5E6',
    '#FFF59D',
    '#F5D9EC'
  ];
  return playerColors[playerId - 1];
};

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

const getPlayerTemplate = function([playerId, player]) {
  const playerColor = getPlayerColor(playerId);
  return `<div class="player" style="background-color: ${playerColor};">
            <p>${player.name}</p>
          </div>`;
};

const showJoinedPlayersName = function(playersDetails) {
  const playersTemplate = Object.entries(playersDetails).map(getPlayerTemplate);
  document.querySelector('#name-area').innerHTML = playersTemplate.join('');
};

const showJoinedPlayers = function({hasGameStarted, playersDetails}) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  $joinedPlayers.innerHTML = Object.keys(playersDetails).length;
  showJoinedPlayersName(playersDetails);
  if (hasGameStarted) {
    setTimeout(() => {
      document.location = 'game.html';
    }, 1000);
  }
};

const sendReqForPlayersDetails = function() {
  fetch('/playersDetails', {method: 'GET'})
    .then(response => response.json())
    .then(showJoinedPlayers);
};

const main = function() {
  sendReqForGameDetails();
  sendReqForPlayersDetails();
  setInterval(sendReqForPlayersDetails, 1000);
};

window.onload = main;
