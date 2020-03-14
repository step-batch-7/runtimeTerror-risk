const servePlayersDetails = function(req, res) {
  const hasGameStarted = req.game.hasStarted;
  res.json({hasGameStarted, playersDetails: req.game.getPlayersDetails()});
};

const serveGameDetails = function(req, res) {
  const {_gameId} = req.cookies;
  const numOfPlayers = req.game.numOfPlayers;
  res.json({gameId: _gameId, numOfPlayers});
};

const hasFields = function(...fields) {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).end('bad Request');
  };
};

const serveGameStatus = function(req, res) {
  res.json(req.game.status);
};

const hostGame = function(req, res) {
  const {playerName, numOfPlayers} = req.body;
  const gameId = req.app.locals.controller.addGame(+numOfPlayers);
  const game = req.app.locals.controller.getGame(gameId);
  const playerId = game.addPlayer(playerName);
  res.cookie('_gameId', `${gameId}`).cookie('_playerId', `${playerId}`);
  res.status(202).json({gameId});
};

const joinGame = function(req, res) {
  const {gameId, playerName} = req.body;
  const game = req.app.locals.controller.getGame(gameId);
  if (!game) {
    res.json({joinStatus: false, errorMsg: `Invalid Game Id(${gameId})`});
    return;
  }
  if (game.hasStarted) {
    return res.json({joinStatus: false, errorMsg: 'Game already started'});
  }
  const playerId = req.app.locals.controller.join(gameId, playerName);
  res.cookie('_gameId', `${gameId}`).cookie('_playerId', `${playerId}`);
  res.status(202).json({joinStatus: true});
};

const findGame = function(req, res, next) {
  const {_gameId} = req.cookies;
  const game = req.app.locals.controller.getGame(_gameId);
  if (game) {
    req.game = game;
    return next();
  }
  res.status(400).json({error: 'Game not found'});
};

const validateGameAction = function(req, res, next) {
  const isActionValid = req.game.isActionValidBy(+req.cookies._playerId);
  if (isActionValid) {
    return next();
  }
  res.status(406).json({error: 'This is not your turn'});
};

const hasGameStarted = function(req, res, next) {
  const hasStarted = req.game.hasStarted;
  if (hasStarted) {
    return next();
  }
  res.redirect('/waiting.html');
};

const performReinforcement = function(req, res) {
  const {territory, militaryCount} = req.body;
  const reinforcementStatus = req.game.reinforce(territory, militaryCount);
  res.json(reinforcementStatus);
};

const performClaim = function(req, res) {
  const {territory} = req.body;
  const claimStatus = req.game.claim(territory);
  res.json(claimStatus);
};

const updatePhase = function(req, res) {
  const currentPhase = req.game.updatePhase();
  res.json({currentPhase});
};

const noAttackIsOn = function(req, res, next) {
  if (!req.game.isAttackGoingOn()) {
    return next();
  }
  res.status(406).json({error: 'Attack is going on'});
};

const attackIsOn = function(req, res, next) {
  if (req.game.isAttackGoingOn()) {
    return next();
  }
  res.status(406).json({error: 'No attack is going on'});
};

const initiateAttack = function(req, res) {
  const {attackFrom} = req.body;
  const attackResult = req.game.initiateAttack(attackFrom);
  attackResult.attacker = attackFrom;
  res.json(attackResult);
};

const selectDefender = function(req, res) {
  const {defender} = req.body;
  const defendingResult = req.game.addDefender(defender);
  defendingResult.defender = defender;
  res.json(defendingResult);
};

const validateDefender = function(req, res, next) {
  const {_playerId} = req.cookies;
  if (req.game.isValidDefender(+_playerId)) {
    return next();
  }
  res.status(406).json({error: 'You are not allowed to defend'});
};

const selectDefenderMilitary = function(req, res) {
  const {militaryUnit} = req.body;
  const response = req.game.addDefenderMilitary(militaryUnit);
  res.json(response);
};

const defenderRollDice = function(req, res) {
  res.end();
};

module.exports = {
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
  defenderRollDice
};
