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

const showJoinedPlayersName = function(playerColorAndName) {
  const $waitingDetailsBox = document.querySelector('.box');
  const joinderPlayers = document.querySelectorAll('.player');
  joinderPlayers.forEach(player => player.parentElement.removeChild(player));
  playerColorAndName.forEach(({color, name}) => {
    const $nameBox = document.createElement('div');
    const $name = document.createElement('p');
    $name.innerHTML = name;
    $nameBox.appendChild($name);
    $nameBox.className = 'player';
    $nameBox.style.backgroundColor = color;
    $waitingDetailsBox.appendChild($nameBox);
  });
};

const showJoinedPlayers = function(response) {
  const $joinedPlayers = document.querySelector('#joinedPlayers');
  const {numOfJoinedPlayers, isAllPlayersJoined, playerColorAndName} = response;
  $joinedPlayers.innerHTML = numOfJoinedPlayers;
  showJoinedPlayersName(playerColorAndName);
  if (isAllPlayersJoined) {
    setTimeout(() => {
      document.location = 'game.html';
    }, 1000);
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
