class Game {
  #countries;
  #players;
  #currentState;
  #currentPlayer;
  constructor(countries, players, currentState, currentPlayer) {
    this.#countries = countries;
    this.#players = players;
    this.#currentState = currentState;
    this.#currentPlayer = currentPlayer;
  }
}

module.exports = { Game };
