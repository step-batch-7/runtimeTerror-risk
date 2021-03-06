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
      player.removeMilitary(1);
      assert.strictEqual(player.status.leftMilitaryCount, 29);
    });
  });

  context('rulingTerritories', () => {
    it('should give ruling territories Ids of the player', function() {
      const player = new Player('Player1', 30);
      player.addTerritory('india');
      assert.deepStrictEqual(player.rulingTerritories, ['india']);
    });
  });

  context('addTerritory', () => {
    it('should add territory to territories list of player', () => {
      const player = new Player('Player1', 30);
      player.addTerritory('india');
      assert.isTrue(player.rulingTerritories.includes('india'));
    });
  });
  context('hasDeployedAllMilitary', () => {
    it('should give true if no military left', function() {
      const player = new Player('player1', 0);
      assert.isOk(player.hasDeployedAllMilitary());
    });

    it('should give false if any military left', function() {
      const player = new Player('player1', 2);
      assert.isNotOk(player.hasDeployedAllMilitary());
    });
  });
});
