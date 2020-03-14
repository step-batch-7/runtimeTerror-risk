const express = require('express');
const cookieParser = require('cookie-parser');
const Controller = require('./controller');

const {
  serveGameStatus,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame,
  serveGameDetails,
  servePlayersDetails,
  validateGameAction,
  hasGameStarted,
  updatePhase,
  initiateAttack,
  noAttackIsOn,
  attackIsOn,
  selectDefender,
  validateDefender,
  selectDefenderMilitary,
  defenderRollDice,
  serveFortifyPossibilities
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

app.post(
  '/selectDefenderMilitary',
  attackIsOn,
  validateDefender,
  hasFields('militaryUnit'),
  selectDefenderMilitary
);

app.get('/defenderRollDice', attackIsOn, validateDefender, defenderRollDice);

app.use(validateGameAction);
app.post(
  '/reinforcement',
  hasFields('territory', 'militaryCount'),
  performReinforcement
);
app.post('/performClaim', hasFields('territory'), performClaim);
app.get('/updatePhase', updatePhase);

app.post(
  '/initiateAttack',
  hasFields('attackFrom'),
  noAttackIsOn,
  initiateAttack
);
app.post('/initiateFortify', serveFortifyPossibilities);

app.use(attackIsOn);
app.post('/selectDefender', hasFields('defender'), selectDefender);

module.exports = { app };
