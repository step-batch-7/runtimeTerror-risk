const getGameStatus = function(req, res) {
  const gameStatus = req.app.locals.game.status;
  res.json(gameStatus);
};

const performReinforcement = function(req, res) {
  const { country, militaryCount } = req.body;
  const reinforcementStatus = req.app.locals.game.reinforcement(country, militaryCount);
  res.json(reinforcementStatus);
};

const claimTerritory = function(req, res) {
  const { playerId, territory } = req.body;
  const response = req.app.locals.game.claimTerritory(playerId, territory);
  res.json(response);
};

module.exports = { getGameStatus, claimTerritory, performReinforcement };
