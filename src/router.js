const express = require('express');
const { getGameStatus } = require('./handlers');
const Game = require('./game');
const app = express();

const game = new Game([]);
game.addPlayer('Player1');

app.locals.game = game;
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '100kb' }));
app.get('/gameStatus', getGameStatus);

module.exports = { app };
