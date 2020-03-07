class Game {
  #countries;
  #players;
  #currentPlayer;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentPlayer;
  }

  get status() {
    const status = { remainingMilitaryCount: 20 };
    return status;
  }
}

module.exports = { Game };
