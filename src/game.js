const Player = require('./player');

class Game {
  #territories;
  #players;
  #currentPlayerId;
  #currentStage;
  #activities;
  constructor(territories) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayerId = 'red';
    this.#currentStage = 1;
    this.#activities = [];
  }

  get status() {
    const status = {};
    const playerStatus = this.#players.red.status;
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
    return this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const newPlayer = new Player(name, 'red', 50);
    this.addActivity(`${name} has joined.`);
    this.#players.red = newPlayer;
    return this.#players.red;
  }

  updateStage() {
    this.#currentStage = this.#currentStage + 1;
    return this.#currentStage;
  }

  claimTerritory(territoryName) {
    if (this.#currentStage != 1) {
      return { status: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { status: false, error: 'territory already occupied' };
    }
    this.#territories[territoryName].changeRuler(this.#currentPlayerId);
    this.#players[this.#currentPlayerId].addTerritory(territoryName);
    this.#territories[territoryName].deployMilitary(1);
    this.#players[this.#currentPlayerId].removeMilitary(1);
    const { id, leftMilitaryCount } = this.#players[
      this.#currentPlayerId
    ].status;
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, color: id, leftMilitaryCount };
  }

  reinforce(territoryName, militaryCount) {
    let error = 'This stage does not support reinforcement';
    if (this.#currentStage != 2) {
      return { status: false, error };
    }

    const player = this.#players[this.#currentPlayerId];
    const territory = this.#territories[territoryName];
    error = 'You can’t place military unit in others territories';
    if (!territory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error };
    }

    territory.deployMilitary(militaryCount);
    player.removeMilitary(militaryCount);
    const players = Object.values(this.#players);
    if (players.every(player => player.status.leftMilitaryCount === 0)) {
      this.updateStage();
    }
    const { leftMilitaryCount } = player.status;
    const territoryMilitaryCount = territory.status.militaryUnits;
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
