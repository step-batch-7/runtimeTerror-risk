const express = require('express');
const cookieParser = require('cookie-parser');
const Controller = require('./controller');

const {
  serveGameStatus,
  serveGameDetails,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame,
  servePlayersDetails,
  authorizeGame,
  hasGameStarted,
  updatePhase
} = require('./handlers');
const app = express();

app.locals.controller = new Controller();

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/game.html', findGame, hasGameStarted);
app.use(express.static('public'));
app.post('/hostGame', hasFields('playerName', 'numOfPlayers'), hostGame);
app.post('/joinGame', hasFields('gameId', 'playerName'), joinGame);
app.use(findGame);
app.get('/playersDetails', servePlayersDetails);
app.get('/gameDetails', serveGameDetails);
app.get('/gameStatus', serveGameStatus);
app.use(authorizeGame);
app.post(
  '/reinforcement',
  hasFields('territory', 'militaryCount'),
  performReinforcement
);
app.post('/performClaim', hasFields('territory'), performClaim);
app.get('/updatePhase', updatePhase);

module.exports = { app };
