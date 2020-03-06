class Game {
  #countries;
  #players;
  #currentState;
  #currentPlayer;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentState = {};
    this.#currentPlayer = {};
  }
}

module.exports = { Game };
