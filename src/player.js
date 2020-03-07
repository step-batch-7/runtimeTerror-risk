class Player {
  #name;
  #color;
  #countries;
  #leftMilitaryCount;
  #cardEligibility;
  #cards;
  constructor(name, color, intialMilitaryCount) {
    this.#name = name;
    this.#color = color;
    this.#countries = [];
    this.#leftMilitaryCount = intialMilitaryCount;
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
}

module.exports = Player;
