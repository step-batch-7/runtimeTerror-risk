class Player {
  #name;
  #territories;
  #leftMilitaryCount;
  #playerId;
  constructor(name, initialMilitaryCount, playerId) {
    this.#name = name;
    this.#territories = [];
    this.#leftMilitaryCount = initialMilitaryCount;
    this.#playerId = playerId;
  }

  get playerId() {
    return this.#playerId;
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
