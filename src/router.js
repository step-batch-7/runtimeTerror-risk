const express = require('express');
const cookieParser = require('cookie-parser');
const Controller = require('./controller');

const {
  getGameStatus,
  getGameDetails,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame,
  getWaitingStatus,
  getPlayerList,
  authorizeGame,
  hasGameStarted
} = require('./handlers');
const app = express();

app.locals.controller = new Controller();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/game.html', findGame, hasGameStarted);
app.use(express.static('public'));
app.post('/hostGame', hasFields('playerName', 'numOfPlayers'), hostGame);
app.post('/joinGame', hasFields('gameId', 'playerName'), joinGame);
app.use(findGame);
app.get('/waitingStatus', getWaitingStatus);
app.get('/playerList', getPlayerList);
app.get('/gameDetails', getGameDetails);
app.get('/gameStatus', getGameStatus);
app.use(authorizeGame);
app.post('/reinforcement', hasFields('territory', 'militaryCount'), performReinforcement);
app.post('/performClaim', hasFields('territory'), performClaim);

module.exports = { app };
