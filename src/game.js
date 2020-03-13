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
    this.#currentPhase = 1;
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
    Object.entries(this.#territories).forEach(([territoryId, territory]) => {
      status.territories[territoryId] = territory.status;
    });
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

  getPlayersDetails() {
    const playersDetails = {};
    Object.entries(this.#players).forEach(([playerId, player]) => {
      playersDetails[playerId] = player.status;
    });
    return playersDetails;
  }

  isActionValidBy(playerId) {
    return this.hasStarted && this.#currentPlayerId === playerId;
  }

  addActivity(msg) {
    this.#activities.unshift({ msg });
  }

  addPlayer(name) {
    const initialMilitaryCount = 20 + (6 - +this.#numOfPlayers) * 5;
    this.#players[++this.#lastPlayerId] = new Player(name, initialMilitaryCount);
    this.#isStarted = this.#numOfPlayers === Object.keys(this.#players).length;
    this.addActivity(`${name} has joined.`);
    return this.#lastPlayerId;
  }

  updateStage() {
    this.#currentStage += 1;
    this.#currentPlayerId = 1;
    const currentStageName = stageNames[this.#currentStage];
    this.addActivity(`${currentStageName} stage started`);
  }

  updatePhase() {
    if (this.#currentStage === 3) {
      this.#currentPhase = (this.#currentPhase % 3) + 1;
    }
    return this.#currentPhase;
  }

  changeTurn() {
    this.#currentPlayerId = this.#currentPlayerId + 1;
    this.#currentPlayerId > this.#numOfPlayers && (this.#currentPlayerId = 1);
  }

  assignOwnerTo(territoryId) {
    const selectedTerritory = this.#territories[territoryId];
    selectedTerritory.changeRuler(this.#currentPlayerId);
    selectedTerritory.deployMilitary(1);
    this.currentPlayer.addTerritory(territoryId);
    this.currentPlayer.removeMilitary(1);
    const { name, leftMilitaryCount } = this.currentPlayer.status;
    this.addActivity(`${name} has claimed ${selectedTerritory.status.name}`);
    this.changeTurn();
    return { leftMilitaryCount };
  }

  claim(territoryName) {
    if (this.#currentStage != 1) {
      return { isDone: false, error: 'wrong stage' };
    }
    if (this.#territories[territoryName].isOccupied()) {
      return { isDone: false, error: 'Territory already claimed' };
    }
    const { leftMilitaryCount } = this.assignOwnerTo(territoryName);
    const territories = Object.values(this.#territories);
    if (territories.every(territory => territory.isOccupied())) {
      this.updateStage();
    }
    return { isDone: true, leftMilitaryCount };
  }

  changeTurnToNextDeployer() {
    do {
      this.changeTurn();
    } while (this.currentPlayer.status.leftMilitaryCount < 1);
  }

  deployMilitaryTo(territory, militaryCount) {
    territory.deployMilitary(militaryCount);
    this.currentPlayer.removeMilitary(militaryCount);
    const activityMsg = `${this.currentPlayer.status.name} placed ${militaryCount} soldier in ${territory.status.name}`;
    this.addActivity(activityMsg);
  }

  reinforce(territoryName, militaryCount) {
    if (this.#currentStage !== 2) {
      return { isDone: false, error: 'Wrong stage or phase' };
    }

    const selectedTerritory = this.#territories[territoryName];
    if (!selectedTerritory.isOccupiedBy(this.#currentPlayerId)) {
      return { isDone: false, error: 'This is not your territory' };
    }

    this.deployMilitaryTo(selectedTerritory, militaryCount);
    Object.values(this.#players).every(hasDeployedAllMilitary) && this.updateStage();
    const { leftMilitaryCount } = this.currentPlayer.status;
    const territoryMilitaryCount = selectedTerritory.status.militaryUnits;
    this.#currentStage === 2 && this.changeTurnToNextDeployer();
    return { isDone: true, leftMilitaryCount, territoryMilitaryCount };
  }
}

module.exports = Game;
