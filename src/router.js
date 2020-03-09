const express = require('express');
const {
  getGameStatus,
  performClaim,
  performReinforcement,
  hasFields
} = require('./handlers');
const Game = require('./game');
const generateTerritories = require('./territories');
const app = express();

const territories = generateTerritories();
const game = new Game(territories);
game.addPlayer('Player1');
game.addPlayer('Player2');
game.addPlayer('Player3');

app.locals.game = game;
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '100kb'}));
app.get('/gameStatus', getGameStatus);
app.post(
  '/reinforcement',
  hasFields('territory', 'militaryCount'),
  performReinforcement
);
app.post('/performClaim', hasFields('territory'), performClaim);

module.exports = {app};
