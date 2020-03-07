const express = require('express');
const { getGameStatus } = require('./handlers');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '100kb'}));
app.get('/gameStatus', getGameStatus);

module.exports = { app };
