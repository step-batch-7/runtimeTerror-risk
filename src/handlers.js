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
  const gameStatus = req.game.status;
  res.json(gameStatus);
};

const performReinforcement = function(req, res) {
  const { territory, militaryCount } = req.body;
  const reinforcementStatus = req.game.reinforceTerritory(
    territory,
    militaryCount
  );
  res.json(reinforcementStatus);
};

const performClaim = function(req, res) {
  const { territory } = req.body;
  const response = req.game.claimTerritory(territory);
  res.json(response);
};

const hostGame = function(req, res) {
  const { playerName, numOfPlayers } = req.body;
  const { gameId, playerId } = req.app.locals.controller.addGame(
    playerName,
    numOfPlayers
  );
  res.cookie('_gameId', `${gameId}`);
  res.cookie('_playerId', `${playerId}`);
  res.json({ gameId });
};

const joinGame = function(req, res) {
  const { gameId, playerName } = req.body;
  const gameValidity = req.app.locals.controller.isValid(gameId);
  if (gameValidity.joinStatus) {
    const playerId = req.app.locals.controller.join(gameId, playerName);
    res.cookie('_gameId', `${gameId}`);
    res.cookie('_playerId', `${playerId}`);
  }
  res.json(gameValidity);
};

const findGame = function(req, res, next) {
  const { _gameId } = req.cookies;
  if (_gameId) {
    req.game = req.app.locals.controller.getGame(_gameId);
    return next();
  }
  res.redirect('/home.html');
};

module.exports = {
  getGameStatus,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame
};
