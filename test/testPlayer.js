const Player = require('../src/player');
const assert = require('chai').assert;

describe('Player', function() {
  it('Should give the instance of player class', function() {
    const player = new Player('india', ['china']);
    assert.instanceOf(player, Player);
  });
});
