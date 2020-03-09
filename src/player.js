class Player {
  #name;
  #color;
  #territories;
  #leftMilitaryCount;
  constructor(name, color, initialMilitaryCount) {
    this.#name = name;
    this.#color = color;
    this.#territories = [];
    this.#leftMilitaryCount = initialMilitaryCount;
  }

  get status() {
    const status = {};
    status.leftMilitaryCount = this.#leftMilitaryCount;
    status.id = this.#color;
    status.name = this.#name;
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
