const getGameStatus = function(req, res) {
  const gameStatus = req.app.locals.game.status;
  res.json(gameStatus);
};

const performReinforcement = function(req, res) {
  const { country, militaryCount } = req.body;
  const reinforcementStatus = req.app.locals.game.reinforcement(
    country,
    militaryCount
  );

  res.json(reinforcementStatus);
};

module.exports = { getGameStatus, performReinforcement };
