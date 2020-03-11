const Player = require('./player');

const stages = { 1: 'Claim', 2: 'Reinforcement', 3: 'Playing' };

const hasDeployedAllMilitary = player => !player.status.leftMilitaryCount;

const createIdGenerator = function*() {
  const ids = ['indianred', 'forestgreen', 'mediumslateblue', 'yellowgreen', 'plum', 'orange'];
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
  #numOfPlayers;
  #isStarted;
  constructor(territories, numOfPlayers) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayerId = 'indianred';
    this.#currentStage = 1;
    this.#activities = [];
    this.#idGenerator = createIdGenerator();
    this.#numOfPlayers = numOfPlayers;
    this.#isStarted = false;
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

  get numOfPlayers() {
    return this.#numOfPlayers;
  }

  get hasStarted() {
    return this.#isStarted;
  }

  get currentPlayer() {
    return this.#players[this.#currentPlayerId];
  }

  get joinedPlayerDetails() {
    const joinedPlayerDetails = {};
    joinedPlayerDetails.numOfJoinedPlayers = Object.keys(this.#players).length;
    joinedPlayerDetails.playerColorAndName = [];
    Object.values(this.#players).forEach(player => {
      const { name, color } = player.status;
      joinedPlayerDetails.playerColorAndName.push({ name, color });
    });
    return joinedPlayerDetails;
  }

  addActivity(msg) {
    return this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const playerId = this.#idGenerator.next().value;
    this.addActivity(`${name} has joined.`);
    this.#players[playerId] = new Player(name, playerId, 20);
    if (this.#numOfPlayers === Object.keys(this.#players).length) {
      this.#isStarted = true;
    }
    return playerId;
  }

  updateStage() {
    this.#currentPlayerId = 'indianred';
    this.#currentStage += 1;
    const currentStageName = stages[this.#currentStage];
    const msg = `${currentStageName} stage started`;
    this.addActivity(msg);
    return this.#currentStage;
  }

  updateCurrentPlayer() {
    const ids = ['indianred', 'forestgreen', 'mediumslateblue', 'yellowgreen', 'plum', 'orange'];
    const index = ids.indexOf(this.#currentPlayerId);
    const nextPlayerIndex = (index + 1) % Object.keys(this.#players).length;
    this.#currentPlayerId = ids[nextPlayerIndex];
    return this.#currentPlayerId;
  }

  assignOwnerTo(territoryId) {
    const territory = this.#territories[territoryId];
    territory.changeRuler(this.#currentPlayerId);
    territory.deployMilitary(1);
    this.currentPlayer.addTerritory(territoryId);
    this.currentPlayer.removeMilitary(1);
    const territoryName = territory.status.name;
    const { name, color, leftMilitaryCount } = this.currentPlayer.status;
    const msg = `${name} has claimed ${territoryName}`;
    this.updateCurrentPlayer();
    this.addActivity(msg);
    return { color, leftMilitaryCount };
  }

  claimTerritory(territoryName) {
    if (this.#currentStage != 1) {
      return { status: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { status: false, error: 'Territory already claimed' };
    }
    const { color, leftMilitaryCount } = this.assignOwnerTo(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, color, leftMilitaryCount };
  }

  changeTurnToNextDeployer() {
    do {
      this.updateCurrentPlayer();
    } while (this.currentPlayer.status.leftMilitaryCount < 1);
  }

  deployMilitaryTo(territory, militaryCount) {
    territory.deployMilitary(militaryCount);
    this.currentPlayer.removeMilitary(militaryCount);
    const activityMsg = `${this.currentPlayer.status.name} placed ${militaryCount} soldier in ${territory.status.name}`;
    this.addActivity(activityMsg);
  }

  reinforceTerritory(territoryName, militaryCount) {
    if (this.#currentStage !== 2) {
      return { status: false, error: 'wrong stage or phase' };
    }

    const selectedTerritory = this.#territories[territoryName];
    if (!selectedTerritory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error: 'This is not your territory' };
    }

    this.deployMilitaryTo(selectedTerritory, militaryCount);
    const players = Object.values(this.#players);
    players.every(hasDeployedAllMilitary) && this.updateStage();
    this.#currentStage === 2 && this.changeTurnToNextDeployer();
    const { leftMilitaryCount } = this.currentPlayer.status;
    const territoryMilitaryCount = selectedTerritory.status.militaryUnits;
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
