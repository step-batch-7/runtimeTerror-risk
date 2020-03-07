class Game {
  #countries;
  #players;
  #currentPlayer;
  #currentStage;
  constructor(countries) {
    this.#countries = countries;
    this.#players = [];
    this.#currentPlayer;
    this.#currentStage = 1;
  }

  get status() {
    const status = {};
    status.remainingMilitaryCount = 20;
    status.currentStage = this.#currentStage;
    return status;
  }
}

module.exports = { Game };
