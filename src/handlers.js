const hasFields = (...fields) => {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.statusCode = 400;
    res.end('bad Request');
  };
};

const getGameStatus = function(req, res) {
  const gameStatus = req.app.locals.game.status;
  res.json(gameStatus);
};

const performReinforcement = function(req, res) {
  const { territory, militaryCount } = req.body;
  const reinforcementStatus = req.app.locals.game.performReinforcement(territory, militaryCount);
  res.json(reinforcementStatus);
};

const performClaim = function(req, res) {
  const { territory } = req.body;
  const response = req.app.locals.game.claimTerritory(territory);
  res.json(response);
};

module.exports = {
  getGameStatus,
  performClaim,
  performReinforcement,
  hasFields
};
