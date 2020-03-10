const Game = require('./game');
const generateTerritories = require('./territories');

class Controller {
  #lastGameId;
  #games;
  constructor() {
    this.#games = {};
    this.#lastGameId = 1000;
  }

  join(gameId, playerName) {
    return this.#games[gameId].addPlayer(playerName);
  }

  addGame(playerName, noOfPlayers) {
    const game = new Game(generateTerritories(), noOfPlayers);
    const playerId = game.addPlayer(playerName);
    const gameId = this.#lastGameId++;
    this.#games[gameId] = game;
    return { gameId, playerId };
  }

  isValid(gameId) {
    let errorMsg = '';
    if (!this.#games[gameId]) {
      errorMsg = `Invalid Game Id(${gameId})`;
      return { joinStatus: false, errorMsg };
    }
    const isGameNotStarted = this.#games[gameId].hasStarted;
    if (isGameNotStarted) {
      errorMsg = `You can't join this Game (${gameId})`;
    }
    return { joinStatus: !isGameNotStarted, errorMsg };
  }

  getGame(gameId) {
    return this.#games[gameId];
  }
}

module.exports = Controller;
