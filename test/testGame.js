const assert = require('chai').assert;
const { Game } = require('../src/game');

describe('Game', function() {
  it('should give instance of game class', function() {
    const game = new Game(['india', 'china']);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game(['india', 'china']);
      assert.deepStrictEqual(game.status, {
        currentStage: 1,
        remainingMilitaryCount: 20
      });
    });
  });
});
