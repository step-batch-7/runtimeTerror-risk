class Territory {
  #name;
  #neighborsName;
  #occupiedBy;
  #militaryUnits;
  constructor(name, neighborsName) {
    this.#name = name;
    this.#neighborsName = neighborsName;
    this.#occupiedBy;
    this.#militaryUnits = 0;
  }

  isOccupiedBy(player) {
    return this.#occupiedBy === player;
  }

  deployMilitary(militaryCount) {
    this.#militaryUnits += militaryCount;
    return this.#militaryUnits;
  }

  isOccupied() {
    return this.#occupiedBy !== undefined;
  }

  changeRuler(playerId) {
    this.#occupiedBy = playerId;
    return this.#occupiedBy;
  }
}

module.exports = Territory;
