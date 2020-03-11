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

  addGame(noOfPlayers) {
    const game = new Game(generateTerritories(), noOfPlayers);
    const gameId = this.#lastGameId++;
    this.#games[gameId] = game;
    return gameId;
  }

  getGame(gameId) {
    return this.#games[gameId];
  }
}

module.exports = Controller;
