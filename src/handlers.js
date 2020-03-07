const getGameStatus = function(req, res) {
  const gameStatus = req.app.locals.game.status;
  res.json(gameStatus);
};

module.exports = { getGameStatus };
