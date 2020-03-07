class Country {
  #name;
  #neighborsName;
  #occupiedBy;
  #militaryUnits;
  constructor(name, neighborsName) {
    this.#name = name;
    this.#neighborsName = neighborsName;
    this.#occupiedBy;
    this.#militaryUnits;
  }
}

module.exports = Country;
