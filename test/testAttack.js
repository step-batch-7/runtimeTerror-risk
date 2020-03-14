const {assert} = require('chai');
const Attack = require('../src/attack');

describe('Attack', () => {
  context('GetAttackerTerritory', () => {
    it('Should give attacker territory', () => {
      const attack = new Attack('india', 'player1');
      assert.strictEqual(attack.attackerTerritory, 'india');
    });
  });
});
