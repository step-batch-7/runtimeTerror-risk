const getPlayersDetails = function(req, res) {
  const hasGameStarted = req.game.hasStarted;
  res.json({ hasGameStarted, playersDetails: req.game.playersDetails });
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
  res.status(202).json({ gameId });
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
  res.status(202).json({ joinStatus: true });
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
  const isCurrentPlayer = req.game.isCurrentPlayer(+req.cookies._playerId);
  if (req.game.hasStarted && isCurrentPlayer) {
    return next();
  }
  res.statusCode = 406;
  res.json({ error: 'This is not your turn' });
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
  const reinforcementStatus = req.game.reinforce(territory, militaryCount);
  res.json(reinforcementStatus);
};

const performClaim = function(req, res) {
  const { territory } = req.body;
  const response = req.game.claim(territory);
  res.json(response);
};

const updatePhase = function(req, res) {
  const currentPhase = req.game.updatePhase();
  res.json({ currentPhase });
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
  getPlayersDetails,
  authorizeGame,
  hasGameStarted,
  updatePhase
};
