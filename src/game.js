const Player = require('./player');

const stageNames = { 1: 'Claim', 2: 'Reinforcement', 3: 'Playing' };

const hasDeployedAllMilitary = player => player.status.leftMilitaryCount < 1;

class Game {
  #territories;
  #players;
  #currentPlayerId;
  #currentStage;
  #activities;
  #numOfPlayers;
  #isStarted;
  #currentPhase;
  #lastPlayerId;
  constructor(territories, numOfPlayers) {
    this.#territories = territories;
    this.#players = {};
    this.#currentPlayerId = 1;
    this.#currentStage = 1;
    this.#activities = [];
    this.#numOfPlayers = numOfPlayers;
    this.#isStarted = false;
    this.#currentPhase = 0;
    this.#lastPlayerId = 0;
  }

  get status() {
    const status = {};
    status.currentPlayer = this.currentPlayer.status;
    status.currentPlayerId = this.#currentPlayerId;
    status.currentStage = this.#currentStage;
    status.currentPhase = this.#currentPhase;
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

  get playerDetails() {
    const playersDetails = {};
    for (let playerId in this.#players) {
      playersDetails[playerId] = this.#players[playerId].status;
    }
    return playersDetails;
  }

  get currentPlayerId() {
    return this.#currentPlayerId;
  }

  addActivity(msg) {
    this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const initialMilitaryCount = 20 + (6 - +this.#numOfPlayers) * 5;
    this.#players[++this.#lastPlayerId] = new Player(
      name,
      initialMilitaryCount
    );
    this.#isStarted = this.#numOfPlayers === Object.keys(this.#players).length;
    this.addActivity(`${name} has joined.`);
    return this.#lastPlayerId;
  }

  updateStage() {
    this.#currentStage += 1;
    this.#currentPlayerId = 1;
    this.updatePhase();
    const currentStageName = stageNames[this.#currentStage];
    const msg = `${currentStageName} stage started`;
    this.addActivity(msg);
  }

  updatePhase() {
    this.#currentStage === 3 && this.#currentPhase++;
  }

  updateCurrentPlayer() {
    this.#currentPlayerId = this.#currentPlayerId + 1;
    this.#currentPlayerId > this.#numOfPlayers && (this.#currentPlayerId = 1);
  }

  assignOwnerTo(territoryId) {
    const territory = this.#territories[territoryId];
    territory.changeRuler(this.#currentPlayerId);
    territory.deployMilitary(1);
    this.currentPlayer.addTerritory(territoryId);
    this.currentPlayer.removeMilitary(1);
    const { name, leftMilitaryCount } = this.currentPlayer.status;
    const msg = `${name} has claimed ${territory.status.name}`;
    this.addActivity(msg);
    this.updateCurrentPlayer();
    return { leftMilitaryCount };
  }

  claimTerritory(territoryName) {
    if (this.#currentStage != 1) {
      return { status: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { status: false, error: 'Territory already claimed' };
    }
    const { leftMilitaryCount } = this.assignOwnerTo(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { status: true, leftMilitaryCount };
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
      return { status: false, error: 'Wrong stage or phase' };
    }

    const selectedTerritory = this.#territories[territoryName];
    if (!selectedTerritory.isOccupiedBy(this.#currentPlayerId)) {
      return { status: false, error: 'This is not your territory' };
    }

    this.deployMilitaryTo(selectedTerritory, militaryCount);
    Object.values(this.#players).every(hasDeployedAllMilitary) &&
      this.updateStage();
    const { leftMilitaryCount } = this.currentPlayer.status;
    const territoryMilitaryCount = selectedTerritory.status.militaryUnits;
    this.#currentStage === 2 && this.changeTurnToNextDeployer();
    return { status: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
