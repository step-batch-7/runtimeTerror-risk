const express = require('express');
const {
  getGameStatus,
  claimTerritory,
  performReinforcement
} = require('./handlers');
const Game = require('./game');
const generateterritories = require('./territories');
const app = express();

const territories = generateterritories();
const game = new Game(territories);
game.addPlayer('Player1');

const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

app.locals.game = game;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.get('/gameStatus', getGameStatus);
app.post(
  '/reinforcement',
  hasFields('country', 'militaryCount'),
  performReinforcement
);
app.post('/claimTerritory', hasFields('playerId', 'territory'), claimTerritory);

module.exports = { app };
