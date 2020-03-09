const Player = require('./player');

const stages = { 1: 'Claim', 2: 'Reinforcement', 3: 'Final' };

const createIdGenerator = function*() {
  const ids = ['crimson', 'forestgreen', 'mediumslateblue', 'yellowgreen', 'plum', 'orange'];
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
  #idGenerator;
  constructor(territories) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayerId = 'crimson';
    this.#currentStage = 1;
    this.#activities = [];
    this.#idGenerator = createIdGenerator();
  }

  get status() {
    const status = {};
    status.currentPlayer = this.#players[this.#currentPlayerId].status;
    status.currentStage = this.#currentStage;
    status.activities = this.#activities.slice();
    status.territories = {};
    for (let territory in this.#territories) {
      status.territories[territory] = this.#territories[territory].status;
    }
    return status;
  }

  addActivity(msg) {
    return this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const id = this.#idGenerator.next().value;
    this.addActivity(`${name} has joined.`);
    this.#players[id] = new Player(name, id, 20);
    return id;
  }

  updateStage() {
    this.#currentPlayerId = 'crimson';
    this.#currentStage = this.#currentStage + 1;
    const currentStageName = stages[this.#currentStage];
    const msg = `${currentStageName} stage started`;
    this.addActivity(msg);
    return this.#currentStage;
  }

  updateCurrentPlayer() {
    const ids = ['crimson', 'forestgreen', 'mediumslateblue', 'yellowgreen', 'plum', 'orange'];
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
      return { status: false, error: 'Territory already claimed' };
    }
    const { id, leftMilitaryCount } = this.claimTerritory(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, color: id, leftMilitaryCount };
  }

  reinforceTerritory(territory, militaryCount, player) {
    territory.deployMilitary(militaryCount);
    player.removeMilitary(militaryCount);
    const activityMsg = `${player.status.name} placed ${militaryCount} soldier in ${territory.status.name}`;
    this.addActivity(activityMsg);
  }

  changeTurn() {
    if (this.#currentStage === 2) {
      do {
        this.updateCurrentPlayer();
      } while (this.#players[this.#currentPlayerId].status.leftMilitaryCount < 1);
    }
  }

  performReinforcement(territoryName, militaryCount) {
    if (this.#currentStage !== 2) {
      return { status: false, error: 'wrong stage or phase' };
    }

    const player = this.#players[this.#currentPlayerId];
    const territory = this.#territories[territoryName];
    if (!territory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error: 'This is not your territory' };
    }

    this.reinforceTerritory(territory, militaryCount, player);

    const players = Object.values(this.#players);
    if (players.every(player => !player.status.leftMilitaryCount)) {
      this.updateStage();
    }

    this.changeTurn();
    const { leftMilitaryCount } = player.status;
    const territoryMilitaryCount = territory.status.militaryUnits;
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
