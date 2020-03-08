const Player = require('./player');

class Game {
  #territories;
  #players;
  #currentPlayer;
  #currentStage;
  #activities;
  constructor(territories) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayer;
    this.#currentStage = 1;
    this.#activities = [];
  }

  get status() {
    const status = {};
    const playerStatus = this.#players.red.status();
    status.remainingMilitaryCount = playerStatus.leftMilitaryCount;
    status.currentStage = this.#currentStage;
    status.activities = this.#activities.slice();
    const territories = {};
    for (const territory in this.#territories) {
      territories[territory] = this.#territories[territory].status;
    }
    status.territories = territories;
    return status;
  }

  addActivity(msg) {
    return this.#activities.unshift({msg});
  }

  addPlayer(name) {
    const newPlayer = new Player(name, 'red', 25);
    this.#currentPlayer = newPlayer;
    this.addActivity(`${name} has joined.`);
    this.#players.red = newPlayer;
    return this.#players.red;
  }

  updateStage() {
    this.#currentStage = (this.#currentStage + 1) % 3;
    return this.#currentStage;
  }

  claimTerritory(playerId, territory) {
    if (this.#currentStage != 1) {
      return {status: false, error: 'wrong stage'};
    }
    if (this.#territories[territory].isOccupied()) {
      return {status: false, error: 'territory already occupied'};
    }
    this.#territories[territory].changeRuler(playerId);
    this.#players[playerId].addTerritory(territory);
    this.#territories[territory].deployMilitary(1);
    const territories = Object.keys(this.#territories);
    if (
      territories.every(territory => this.#territories[territory].isOccupied())
    ) {
      this.updateStage();
    }
    return {status: true, color: playerId};
  }

  reinforcement(territory, militaryCount) {
    if (this.#currentStage != 2) {
      return {status: false};
    }
    const message = 'You can’t place military unit in others territories';
    const playerId = this.#currentPlayer.status().id;
    if (!this.#territories[territory].isOccupiedBy(playerId)) {
      return {status: false, message};
    }
    this.#territories[territory].deployMilitary(militaryCount);
    this.#currentPlayer.removeMilitary(militaryCount);
    const playerIds = Object.keys(this.#players);
    if (
      playerIds.every(
        playerId => this.#players[playerId].status().leftMilitaryCount === 0
      )
    ) {
      this.updateStage();
    }
    return {status: true};
  }
}

module.exports = Game;
