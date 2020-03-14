class Territory {
  #id;
  #name;
  #neighbors;
  #occupiedBy;
  #militaryUnits;
  constructor(id, neighbors, name) {
    this.#id = id;
    this.#name = name;
    this.#neighbors = neighbors;
    this.#occupiedBy;
    this.#militaryUnits = 0;
  }

  get neighbors() {
    return this.#neighbors;
  }

  isOccupiedBy(playerId) {
    return this.#occupiedBy === playerId;
  }

  deployMilitary(militaryCount) {
    this.#militaryUnits += militaryCount;
  }

  isOccupied() {
    return this.#occupiedBy !== undefined;
  }

  changeRuler(playerId) {
    this.#occupiedBy = playerId;
  }

  get status() {
    const status = {};
    status.id = this.#id;
    status.name = this.#name;
    status.occupiedBy = this.#occupiedBy;
    status.neighborsName = this.#neighbors.slice();
    status.militaryUnits = this.#militaryUnits;
    return status;
  }
}

module.exports = Territory;
