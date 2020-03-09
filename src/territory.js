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

  isOccupiedBy(playerId) {
    return this.#occupiedBy === playerId;
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

  get status() {
    return {
      name: this.#name,
      occupiedBy: this.#occupiedBy,
      neighborsName: this.#neighborsName,
      militaryUnits: this.#militaryUnits
    };
  }
}

module.exports = Territory;
