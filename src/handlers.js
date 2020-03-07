const Game = require('./game');
const game = new Game([]);
game.addPlayer('Player1');

const getGameStatus = function(req, res) {
  const gameStatus = game.status;
  res.json(gameStatus);
};

module.exports = { getGameStatus };
