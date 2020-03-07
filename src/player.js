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

  get status() {
    const playerDetails = { leftMilitaryCount: this.#leftMilitaryCount };
    return playerDetails;
  }

  get name() {
    return this.#name;
  }

  get leftMilitaryCount() {
    return this.#leftMilitaryCount;
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
