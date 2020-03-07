class Player {
  #name;
  #id;
  #territories;
  #leftMilitaryCount;
  #cardEligibility;
  #cards;
  constructor(name, id, initialMilitaryCount) {
    this.#name = name;
    this.#id = id;
    this.#territories = [];
    this.#leftMilitaryCount = initialMilitaryCount;
    this.#cardEligibility = false;
    this.#cards = [];
  }

  status() {
    const playerDetails = {
      leftMilitaryCount: this.#leftMilitaryCount,
      id: this.#id
    };
    return playerDetails;
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
