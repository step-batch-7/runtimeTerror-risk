const Player = require('./player');

class Game {
  #countries;
  #players;
  #currentPlayer;
  #currentStage;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentPlayer;
    this.#currentStage = 1;
  }

  get status() {
    const status = {};
    const playerStatus = this.#players[0].status;
    status.remainingMilitaryCount = playerStatus.leftMilitaryCount;
    status.currentStage = this.#currentStage;
    return status;
  }

  addPlayer(name) {
    const newPlayer = new Player(name, 'red', 25);
    this.#players.push(newPlayer);
    return this.#players.length;
  }
}

module.exports = Game;
