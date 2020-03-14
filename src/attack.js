const generateDiceValues = function(dices) {
  const dice = new Array(dices);
  return dice.map(() => Math.ceil(Math.random() * 6));
};

class Attack {
  #from;
  #to;
  #attacker;
  #defender;
  #attackerMilitary;
  #defenderMilitary;
  constructor(from, attacker) {
    this.#from = from;
    this.#attacker = attacker;
    this.#to;
    this.#defender;
    this.#attackerMilitary;
    this.#defenderMilitary;
  }

  get status() {
    const status = {};
    status.from = this.#from;
    status.to = this.#to;
    status.attacker = this.#attacker;
    status.defender = this.#defender;
    return status;
  }

  get attackerTerritory() {
    return this.#from;
  }

  get getDefender() {
    return this.#defender;
  }

  addDefender(to, defender) {
    this.#to = to;
    this.#defender = defender;
  }

  addAttackerMilitary(militaryUnit = 1) {
    this.#attackerMilitary = militaryUnit;
    return this.#from.removeMilitary(militaryUnit);
  }

  addDefenderMilitary(militaryUnit = 1) {
    this.#defenderMilitary = militaryUnit;
    return this.#to.removeMilitary(militaryUnit);
  }

  rollDefenderDice() {
    return;
  }

  isValidDefender(playerId) {
    return playerId === this.#defender.playerId;
  }
}
module.exports = Attack;
