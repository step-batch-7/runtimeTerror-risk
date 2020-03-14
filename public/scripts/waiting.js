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

const showGameDetails = function({ gameId, numOfPlayers }) {
  const $gameId = document.querySelector('#gameId');
  const $totalPlayers = document.querySelector('#totalPlayers');
  $gameId.innerHTML = `Game Id: ${gameId}`;
  $totalPlayers.innerHTML = numOfPlayers;
};

const sendReqForGameDetails = function() {
  sendGETRequest('gameDetails', showGameDetails);
};

const getPlayerHTML = function([playerId, player]) {
  const playerColor = getPlayerColor(playerId);
  return `<div class="player" style="background-color: ${playerColor};">
            <p>${player.name}</p>
          </div>`;
};

const showJoinedPlayers = function({ hasGameStarted, playersDetails }) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  $joinedPlayers.innerHTML = Object.keys(playersDetails).length;
  const playersTemplate = Object.entries(playersDetails).map(getPlayerHTML);
  document.querySelector('#name-area').innerHTML = playersTemplate.join('');
  if (hasGameStarted) {
    setTimeout(() => {
      document.location = 'game.html';
    }, 1000);
  }
};

const sendReqForPlayersDetails = function() {
  sendGETRequest('/playersDetails', showJoinedPlayers);
};

const main = function() {
  sendReqForGameDetails();
  sendReqForPlayersDetails();
  setInterval(sendReqForPlayersDetails, 1000);
};

window.onload = main;
