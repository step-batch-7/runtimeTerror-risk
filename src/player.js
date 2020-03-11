class Player {
  #name;
  #color;
  #territories;
  #leftMilitaryCount;
  constructor(name, initialMilitaryCount) {
    this.#name = name;
    this.#territories = [];
    this.#leftMilitaryCount = initialMilitaryCount;
  }

  get status() {
    const status = {};
    status.name = this.#name;
    status.leftMilitaryCount = this.#leftMilitaryCount;
    return status;
  }

  removeMilitary(count) {
    this.#leftMilitaryCount -= count;
    return this.#leftMilitaryCount;
  }

  addTerritory(territory) {
    return this.#territories.push(territory);
  }
}

module.exports = Player;
