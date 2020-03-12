class Player {
  #name;
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
    status.territories = this.#territories.slice();
    return status;
  }

  removeMilitary(count) {
    this.#leftMilitaryCount -= count;
  }

  addTerritory(territory) {
    this.#territories.push(territory);
  }
}

module.exports = Player;
