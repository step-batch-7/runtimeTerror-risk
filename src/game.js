const Player = require('./player');

class Game {
  #countries;
  #players;
  #currentPlayer;
  #currentStage;
  #activities;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentPlayer;
    this.#currentStage = 1;
    this.#activities = [];
  }

  get status() {
    const status = {};
    const playerStatus = this.#players[0].status;
    status.remainingMilitaryCount = playerStatus.leftMilitaryCount;
    status.currentStage = this.#currentStage;
    status.activities = this.#activities.slice();
    return status;
  }

  addActivity(msg) {
    return this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const newPlayer = new Player(name, 'red', 25);
    this.#currentPlayer = newPlayer;
    this.addActivity(`${name} has joined.`);
    return this.#players.push(newPlayer);
  }

  reinforcement(country, militaryCount) {
    if (this.#currentStage != 2) {
      return { status: false };
    }
    const message = 'You can’t place military unit in others territories';
    if (!this.#countries[country].isOccupiedBy(this.#currentPlayer.name)) {
      return { status: false, message };
    }
    this.#countries[country].deployMilitary(militaryCount);
    this.#currentPlayer.removeMilitary(militaryCount);
    if (this.#players.every(player => player.leftMilitaryCount === 0)) {
      this.#currentStage += 1;
    }
    return { status: true };
  }
}

module.exports = Game;
