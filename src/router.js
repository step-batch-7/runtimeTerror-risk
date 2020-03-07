const express = require('express');
const generateCountries = require('./countries');
const { getGameStatus, performReinforcement } = require('./handlers');
const Game = require('./game');
const app = express();

const game = new Game(generateCountries());
game.addPlayer('Player1');

app.locals.game = game;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.get('/gameStatus', getGameStatus);
app.post('/reinforcement', performReinforcement);

module.exports = { app };
