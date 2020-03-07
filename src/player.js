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
}

module.exports = Player;
