const express = require('express');
const { getGameStatus, claimTerritory, performReinforcement, hasFields } = require('./handlers');
const Game = require('./game');
const generateTerritories = require('./territories');
const app = express();

const territories = generateTerritories();
const game = new Game(territories);
game.addPlayer('Player1');

app.locals.game = game;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.get('/gameStatus', getGameStatus);
app.post('/reinforcement', hasFields('territory', 'militaryCount'), performReinforcement);
app.post('/claimTerritory', hasFields('territory'), claimTerritory);

module.exports = { app };
