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
      id: this.#id,
      name: this.#name,
      occupiedBy: this.#occupiedBy,
      neighborsName: this.#neighbors.slice(),
      militaryUnits: this.#militaryUnits
    };
  }
}

module.exports = Territory;
