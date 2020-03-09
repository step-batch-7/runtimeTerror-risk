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
    status.currentPlayer = this.currentPlayer.status;
    status.currentStage = this.#currentStage;
    status.activities = this.#activities.slice();
    status.territories = {};
    for (let territory in this.#territories) {
      status.territories[territory] = this.#territories[territory].status;
    }
    return status;
  }

  get currentPlayer() {
    return this.#players[this.#currentPlayerId];
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
    this.#currentStage += 1;
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

  assignOwnerTo(territoryName) {
    const territory = this.#territories[territoryName];
    territory.changeRuler(this.#currentPlayerId);
    territory.deployMilitary(1);
    this.currentPlayer.addTerritory(territoryName);
    this.currentPlayer.removeMilitary(1);
    const { name, id, leftMilitaryCount } = this.currentPlayer.status;
    const msg = `${name} is claimed ${territoryName}`;
    this.updateCurrentPlayer();
    this.addActivity(msg);
    return { id, leftMilitaryCount };
  }

  claimTerritory(territoryName) {
    if (this.#currentStage != 1) {
      return { status: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { status: false, error: 'Territory already claimed' };
    }
    const { id, leftMilitaryCount } = this.assignOwnerTo(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, color: id, leftMilitaryCount };
  }

  changeTurnToNextDeployer() {
    do {
      this.updateCurrentPlayer();
    } while (this.currentPlayer.status.leftMilitaryCount < 1);
  }

  reinforceTerritory(territory, militaryCount) {
    territory.deployMilitary(militaryCount);
    this.currentPlayer.removeMilitary(militaryCount);
    const activityMsg = `${this.currentPlayer.status.name} placed ${militaryCount} soldier in ${territory.status.name}`;
    this.addActivity(activityMsg);
  }

  performReinforcement(territoryName, militaryCount) {
    if (this.#currentStage !== 2) {
      return { status: false, error: 'wrong stage or phase' };
    }

    const territory = this.#territories[territoryName];
    if (!territory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error: 'This is not your territory' };
    }

    this.reinforceTerritory(territory, militaryCount);

    const players = Object.values(this.#players);
    if (players.every(player => !player.status.leftMilitaryCount)) {
      this.updateStage();
    }

    this.#currentStage === 2 && this.changeTurnToNextDeployer();
    const { leftMilitaryCount } = this.currentPlayer.status;
    const territoryMilitaryCount = territory.status.militaryUnits;
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
