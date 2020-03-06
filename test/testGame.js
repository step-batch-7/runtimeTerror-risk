const assert = require('chai').assert;
const { Game } = require('../src/game');

describe('Game', function() {
  it('should give instance of game class', function() {
    const game = new Game(['india', 'china'], {}, {}, 'Player1');
    assert.instanceOf(game, Game);
  });
});
