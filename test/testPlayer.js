const Player = require('../src/player');
const { assert } = require('chai');

describe('Player', function() {
  it('Should give the instance of player class', function() {
    const player = new Player('india', 20);
    assert.instanceOf(player, Player);
  });

  context('status', () => {
    it('should give status of player', () => {
      const player = new Player('Player1', 30);
      assert.deepStrictEqual(player.status, {
        leftMilitaryCount: 30,
        name: 'Player1'
      });
    });
  });

  context('removeMilitary', () => {
    it('should give removeMilitary of the player', () => {
      const player = new Player('Player1', 30);
      assert.strictEqual(player.removeMilitary(1), 29);
    });
  });

  context('addTerritory', () => {
    it('should add territory to territories list of player', () => {
      const player = new Player('Player1', 30);
      assert.strictEqual(player.addTerritory('india'), 1);
    });
  });
});
