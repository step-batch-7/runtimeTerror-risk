const express = require('express');
const {
  getGameStatus,
<<<<<<< HEAD
  performClaim,
=======
  claimTerritory,
>>>>>>> |#13|Noora/Drishya| Added changeTurn method in game class
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
game.addPlayer('Player4');
game.addPlayer('Player5');

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
<<<<<<< HEAD
app.post('/performClaim', hasFields('territory'), performClaim);
=======
app.post('/claimTerritory', hasFields('territory'), claimTerritory);
>>>>>>> |#13|Noora/Drishya| Added changeTurn method in game class

module.exports = {app};
