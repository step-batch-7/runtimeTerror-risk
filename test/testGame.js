const { assert } = require('chai');
const Game = require('../src/game');
const Player = require('../src/player');
const generateTerritories = require('../src/territories');

describe('Game', function() {
  it('should give instance of game class', function() {
    const game = new Game(['india', 'china']);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game(['india', 'china']);
      game.addPlayer('John');
      assert.isObject(game.status);
    });
  });

  context('addPlayer', () => {
    it('should add a new player in player list', () => {
      const game = new Game(['india', 'china']);
      assert.instanceOf(game.addPlayer('Player1'), Player);
    });
  });

  context('addActivity', () => {
    it('should add a new activity', () => {
      const game = new Game(['india', 'china']);
      assert.strictEqual(game.addActivity('New game started'), 1);
    });
  });

  context('reinforcement', () => {
    it('should give false status when the stage is not 2 ', () => {
      const game = new Game(generateTerritories());
      assert.deepStrictEqual(game.reinforcement('india', 1), {
        status: false
      });
    });

    it('should give true status when reinforcement is done', () => {
      const india = generateTerritories().india;
      const game = new Game({india});
      game.addPlayer('Player1');
      game.claimTerritory('red', 'india');
      assert.deepStrictEqual(game.reinforcement('india', 1), {
        status: true,
        leftMilitaryCount: 24,
        territoryMilitaryCount: 2
      });
    });
  });

  context('updateStage', () => {
    it('should update the stage of game', () => {
      const game = new Game(['india', 'china']);
      assert.strictEqual(game.updateStage(), 2);
    });
  });

  context('claimTerritory', () => {
    const game = new Game(generateTerritories());
    game.addPlayer('Player1');
    it('should claim territory if it is unclaimed', () => {
      assert.deepStrictEqual(game.claimTerritory('red', 'india'), {
        status: true,
        color: 'red'
      });
    });

    it('should give error message if it is claimed', () => {
      assert.deepStrictEqual(game.claimTerritory('red', 'india'), {
        status: false,
        error: 'territory already occupied'
      });
    });

    it('should give error message if it is not in claim stage', () => {
      game.updateStage();
      assert.deepStrictEqual(game.claimTerritory('red', 'india'), {
        status: false,
        error: 'wrong stage'
      });
    });
  });
});
