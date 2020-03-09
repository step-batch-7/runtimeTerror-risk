const Player = require('../src/player');
const {assert} = require('chai');

describe('Player', function() {
  it('Should give the instance of player class', function() {
    const player = new Player('india', ['china']);
    assert.instanceOf(player, Player);
  });

  context('status', () => {
    it('should give status of player', () => {
      const player = new Player('Player1', 'red', 30);
      assert.deepStrictEqual(player.status, {
        leftMilitaryCount: 30,
        id: 'red',
        name: 'Player1'
      });
    });
  });

  context('removeMilitary', () => {
    it('should give removeMilitary of the player', () => {
      const player = new Player('Player1', 'red', 30);
      assert.strictEqual(player.removeMilitary(1), 29);
    });
  });

  context('addTerritory', () => {
    it('should add territory to territories list of player', () => {
      const player = new Player('Player1', 'red', 30);
      assert.strictEqual(player.addTerritory('india'), 1);
    });
  });
});
