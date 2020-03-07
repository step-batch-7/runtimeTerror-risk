class Country {
  #name;
  #neighborsName;
  #occupiedBy;
  #militaryUnits;
  constructor(name, neighborsName) {
    this.#name = name;
    this.#neighborsName = neighborsName;
    this.#occupiedBy = 'Player1';
    this.#militaryUnits = 0;
  }

  isOccupiedBy(player) {
    return this.#occupiedBy === player;
  }

  deployMilitary(militaryCount) {
    this.#militaryUnits += militaryCount;
    return this.#militaryUnits;
  }
}

module.exports = Country;
