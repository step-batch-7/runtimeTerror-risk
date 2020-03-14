const Player = require('./player');
const Attack = require('./attack');

const stageNames = { 1: 'Claim', 2: 'Reinforcement', 3: 'Playing' };

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
  #attack;
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
    this.#attack = '';
  }

  get status() {
    const status = {};
    status.currentPlayer = this.currentPlayer.status;
    status.currentPlayer.id = this.#currentPlayerId;
    status.currentStage = this.#currentStage;
    status.currentPhase = this.#currentPhase;
    status.activities = this.#activities.slice();
    status.territories = {};
    Object.entries(this.#territories).forEach(([territoryId, territory]) => {
      status.territories[territoryId] = territory.status;
    });
    if (this.#attack) {
      status.attackDetail = this.#attack.status;
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
    const playerId = ++this.#lastPlayerId;
    this.#players[playerId] = new Player(name, initialMilitaryCount, playerId);
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
    this.#currentPlayerId = (this.#currentPlayerId % this.#numOfPlayers) + 1;
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

  deployMilitary(territory, militaryCount) {
    const remainingMilitary = territory.deployMilitary(militaryCount);
    this.currentPlayer.removeMilitary(militaryCount);
    const activityMsg = `${this.currentPlayer.status.name} placed ${militaryCount} soldier in ${territory.status.name}`;
    this.addActivity(activityMsg);
    return remainingMilitary;
  }

  reinforce(territoryName, militaryCount) {
    if (this.#currentStage !== 2) {
      return { isDone: false, error: 'Wrong stage or phase' };
    }

    const selectedTerritory = this.#territories[territoryName];
    if (!selectedTerritory.isOccupiedBy(this.#currentPlayerId)) {
      return { isDone: false, error: 'This is not your territory' };
    }

    this.deployMilitary(selectedTerritory, militaryCount);
    const allPlayers = Object.values(this.#players);
    allPlayers.every(player => player.hasDeployedAllMilitary()) &&
      this.updateStage();
    const { leftMilitaryCount } = this.currentPlayer.status;
    const territoryMilitaryCount = selectedTerritory.status.militaryUnits;
    this.#currentStage === 2 && this.changeTurnToNextDeployer();
    return { isDone: true, territoryMilitaryCount, leftMilitaryCount };
  }

  getTerritory(territoryId) {
    return this.#territories[territoryId];
  }

  isMine(territoryId) {
    const territory = this.getTerritory(territoryId);
    return territory.isOccupiedBy(this.#currentPlayerId);
  }

  isAttackGoingOn() {
    return this.#attack instanceof Attack;
  }
  initiateAttack(attackFrom) {
    const territory = this.getTerritory(attackFrom);
    const neighbors = territory.neighbors.filter(neighbor => {
      return !this.isMine(neighbor);
    });
    if (!this.isMine(attackFrom) || !neighbors.length) {
      return { status: false, error: 'Invalid Territory for Attack' };
    }
    if (territory.status.militaryUnits > 1) {
      this.#attack = new Attack(territory, this.currentPlayer);
      return { status: true, error: '', neighbors };
    }
    return { status: false, error: 'You don’t have enough military units' };
  }
  addDefender(defendFrom) {
    const attackerTerritory = this.#attack.attackerTerritory;
    const isNeighbor = attackerTerritory.neighbors.includes(defendFrom);
    if (isNeighbor && !this.isMine(defendFrom)) {
      const defenderTerritory = this.getTerritory(defendFrom);
      const defenderId = defenderTerritory.status.occupiedBy;
      const defender = this.#players[defenderId];
      this.#attack.addDefender(defenderTerritory, defender);
      return { status: true, error: '' };
    }
    this.#attack = '';
    return { status: false, error: "You can't attack this territory" };
  }
  addAttackerMilitary(militaryUnit) {
    const leftMilitaryUnit = this.#attack.addAttackerMilitary(militaryUnit);
    return { leftMilitaryUnit, dice: militaryUnit };
  }
  addDefenderMilitary(militaryUnit) {
    const leftMilitaryUnit = this.#attack.addDefenderMilitary(militaryUnit);
    return { leftMilitaryUnit, dice: militaryUnit };
  }
  isValidDefender(playerId) {
    return this.#attack.isValidDefender(playerId);
  }
  rollDefenderDice() {
    this.#attack.rollDefenderDice();
  }

  getFortifyPossibilities(selectedTerritoryId) {
    if (this.#currentStage !== 3 || this.#currentPhase !== 3) {
      return { isAccepted: false, error: 'Wrong stage or phase' };
    }
    const selectedTerritory = this.#territories[selectedTerritoryId];
    if (!selectedTerritory.isOccupiedBy(this.#currentPlayerId)) {
      return { isAccepted: false, error: 'This is not your territory' };
    }
    if (selectedTerritory.status.militaryUnits === 1) {
      return { isAccepted: false, error: 'Only 1 military in this territory' };
    }
    const currPlayerTerritories = this.currentPlayer.rulingTerritories;
    const validTerritories = currPlayerTerritories.filter(territoryId => {
      return territoryId != selectedTerritoryId;
    });
    const maxValidMilitaryUnits = selectedTerritory.status.militaryUnits - 1;
    return { isAccepted: true, validTerritories, maxValidMilitaryUnits };
  }

  fortify(selectedTerritoryId, targetTerritoryId, militaryUnits) {
    if (!this.currentPlayer.rulingTerritories.includes(targetTerritoryId)) {
      return { isDone: false, error: 'Invalid selection' };
    }
    const selectedTerritory = this.#territories[selectedTerritoryId];
    const selectedTerritoryMilitary = selectedTerritory.removeMilitary(
      militaryUnits
    );
    const targetTerritory = this.#territories[targetTerritoryId];
    const targetTerritoryMilitary = targetTerritory.deployMilitary(
      militaryUnits
    );
    return { isDone: true, selectedTerritoryMilitary, targetTerritoryMilitary };
  }
}

module.exports = Game;
