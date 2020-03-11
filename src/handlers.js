const getWaitingStatus = function(req, res) {
  const isAllPlayersJoined = req.game.hasStarted;
  const { numOfJoinedPlayers, playerColorAndName } = req.game.playerDetails;
  res.json({ numOfJoinedPlayers, isAllPlayersJoined, playerColorAndName });
};

const getGameDetails = function(req, res) {
  const { _gameId } = req.cookies;
  const numOfPlayers = req.game.numOfPlayers;
  res.json({ gameId: _gameId, numOfPlayers });
};

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

const hostGame = function(req, res) {
  const { playerName, numOfPlayers } = req.body;
  const gameId = req.app.locals.controller.addGame(+numOfPlayers);
  const game = req.app.locals.controller.getGame(gameId);
  const playerId = game.addPlayer(playerName);
  res.cookie('_gameId', `${gameId}`).cookie('_playerId', `${playerId}`);
  res.json({ gameId });
};

const joinGame = function(req, res) {
  const { gameId, playerName } = req.body;
  const game = req.app.locals.controller.getGame(gameId);
  if (!game) {
    res.json({ joinStatus: false, errorMsg: `Invalid Game Id(${gameId})` });
    return;
  }
  if (game.hasStarted) {
    return res.json({ joinStatus: false, errorMsg: 'Game already started' });
  }
  const playerId = req.app.locals.controller.join(gameId, playerName);
  res.cookie('_gameId', `${gameId}`).cookie('_playerId', `${playerId}`);
  res.json({ joinStatus: true });
};

const findGame = function(req, res, next) {
  const { _gameId } = req.cookies;
  const game = req.app.locals.controller.getGame(_gameId);
  if (game) {
    req.game = game;
    return next();
  }
  res.statusCode = 400;
  res.json({ error: 'Game not found' });
};

const authorizeGame = function(req, res, next) {
  const player = req.game.currentPlayerId;
  if (player === req.cookies._playerId && req.game.hasStarted) {
    return next();
  }
  res.statusCode = 404;
  res.json({ error: 'invalid action' });
};

const hasGameStarted = function(req, res, next) {
  const hasStarted = req.game.hasStarted;
  if (hasStarted) {
    return next();
  }
  res.redirect('/waiting.html');
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

module.exports = {
  getGameStatus,
  performClaim,
  performReinforcement,
  hasFields,
  findGame,
  hostGame,
  joinGame,
  getGameDetails,
  getWaitingStatus,
  authorizeGame,
  hasGameStarted
};
