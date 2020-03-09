const Player = require('./player');

const idGenerator = function*() {
  const ids = ['crimson', 'yellow', 'blue', 'green', 'pink', 'cyan'];
  while (ids.length) {
    yield ids.shift();
  }
};
class Game {
  #territories;
  #players;
  #currentPlayerId;
  #currentStage;
  #activities;
  #getId;
  constructor(territories) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayerId = 'crimson';
    this.#currentStage = 1;
    this.#activities = [];
    this.#getId = idGenerator();
  }

  get status() {
    const status = {};
    const playerStatus = this.#players.crimson.status;
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
    const id = this.#getId.next().value;
    const newPlayer = new Player(name, id, 25);
    this.addActivity(`${name} has joined.`);
    this.#players[id] = newPlayer;
    return this.#players[id];
  }

  updateStage() {
    this.#currentPlayerId = 'crimson';
    this.#currentStage = this.#currentStage + 1;
    return this.#currentStage;
  }

  updateCurrentPlayer() {
    const ids = ['crimson', 'yellow', 'blue', 'green', 'pink', 'cyan'];
    const index = ids.indexOf(this.#currentPlayerId);
    const nextPlayerIndex = (index + 1) % Object.keys(this.#players).length;
    this.#currentPlayerId = ids[nextPlayerIndex];
    return this.#currentPlayerId;
  }

  claimTerritory(territoryName) {
    const territory = this.#territories[territoryName];
    const player = this.#players[this.#currentPlayerId];
    territory.changeRuler(this.#currentPlayerId);
    territory.deployMilitary(1);
    player.addTerritory(territoryName);
    player.removeMilitary(1);
    const { name, id, leftMilitaryCount } = player.status;
    const msg = `${name} is claimed ${territoryName}`;
    this.updateCurrentPlayer();
    this.addActivity(msg);
    return { id, leftMilitaryCount };
  }

  performClaim(territoryName) {
    if (this.#currentStage != 1) {
      return { status: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { status: false, error: 'territory already occupied' };
    }
    const { id, leftMilitaryCount } = this.claimTerritory(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, color: id, leftMilitaryCount };
  }

  changeTurn() {
    if (this.#currentStage === 2) {
      do {
        this.updateCurrentPlayer();
      } while (
        this.#players[this.#currentPlayerId].status.leftMilitaryCount < 1
      );
    }
  }

  reinforce(territoryName, militaryCount) {
    if (this.#currentStage === 1) {
      return { status: false, error: 'wrong stage or phase' };
    }

    const player = this.#players[this.#currentPlayerId];
    const territory = this.#territories[territoryName];
    if (!territory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error: 'This is not your territory' };
    }

    territory.deployMilitary(militaryCount);
    player.removeMilitary(militaryCount);
    const activityMsg = `${player.status.name} placed ${militaryCount} soldier in ${territoryName}`;
    this.addActivity(activityMsg);

    const players = Object.values(this.#players);
    if (players.every(player => !player.status.leftMilitaryCount)) {
      this.updateStage();
      this.#currentPlayerId = 'crimson';
    }
    this.changeTurn();
    const { leftMilitaryCount } = player.status;
    const territoryMilitaryCount = territory.status.militaryUnits;
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
