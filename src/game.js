class Game {
  #countries;
  #players;
  #currentPlayer;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentPlayer;
  }
}

module.exports = { Game };
