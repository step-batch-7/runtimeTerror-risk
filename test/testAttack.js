const {assert} = require('chai');
const Attack = require('../src/attack');
const Player = require('../src/player');
const Territory = require('../src/territory');

describe('Attack', () => {
  context('GetAttackerTerritory', () => {
    it('Should give attacker territory', () => {
      const attack = new Attack('india', 'player1');
      assert.strictEqual(attack.attackerTerritory, 'india');
    });
  });

  context('AddAttackerMilitaryUnit', () => {
    const india = new Territory('india', ['china'], 'India');
    india.deployMilitary(5);
    it('Should add Attacker military Unit', () => {
      const attack = new Attack(india, 'player1');
      assert.strictEqual(attack.addAttackerMilitary(2), 3);
    });
  });

  context('AddDefenderMilitaryUnit', () => {
    const india = new Territory('india', ['china'], 'India');
    const china = new Territory('china', ['india'], 'india');
    china.deployMilitary(5);
    it('Should add Attacker military Unit', () => {
      const attack = new Attack(india, 'player1');
      attack.addDefender(china, 'player2');
      assert.strictEqual(attack.addDefenderMilitary(2), 3);
    });
  });

  context('isValidDefender', () => {
    const attacker = new Player('player1', 1, 1);
    const defender = new Player('player2', 1, 2);
    it('should give true if given player is defender', () => {
      const attack = new Attack('india', attacker);
      attack.addDefender('china', defender);
      assert.isTrue(attack.isValidDefender(2));
    });
    it('should give false if given player is not defender', () => {
      const attack = new Attack('india', attacker);
      attack.addDefender('china', defender);
      assert.isFalse(attack.isValidDefender(1));
    });
  });
});
