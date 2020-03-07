const assert = require('chai').assert;
const Game = require('../src/game');

describe('Game', function() {
  it('should give instance of game class', function() {
    const game = new Game(['india', 'china']);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game(['india', 'china']);
      game.addPlayer('John');
      assert.deepStrictEqual(game.status, {
        currentStage: 1,
        remainingMilitaryCount: 25
      });
    });
  });

  context('addPlayer', () => {
    it('should add a new player in player list', () => {
      const game = new Game(['india', 'china']);
      assert.strictEqual(game.addPlayer('Player1'), 1);
    });
  });

  context('addActivity', () => {
    it('should add a new activity', () => {
      const game = new Game(['india', 'china']);
      assert.strictEqual(game.addActivity('New game started'), 1);
    });
  });
});
