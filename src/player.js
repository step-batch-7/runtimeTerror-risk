class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.countries = [];
    this.leftMilitaryCount;
    this.cardEligibility = false;
    this.cards = [];
  }
}

module.exports = Player;
