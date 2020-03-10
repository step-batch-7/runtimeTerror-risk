const express = require('express');
const cookieParser = require('cookie-parser');
const Controller = require('./controller');

const {
  getGameStatus,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame
} = require('./handlers');
const app = express();

app.locals.controller = new Controller();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.post('/hostGame', hasFields('playerName', 'numOfPlayers'), hostGame);
app.post('/joinGame', hasFields('gameId', 'playerName'), joinGame);
app.use(findGame);
app.get('/gameStatus', getGameStatus);
app.post(
  '/reinforcement',
  hasFields('territory', 'militaryCount'),
  performReinforcement
);
app.post('/performClaim', hasFields('territory'), performClaim);

module.exports = { app };
