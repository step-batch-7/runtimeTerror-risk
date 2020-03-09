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

  context('reinforce', () => {
    it('should give false status when the stage is not 2 ', () => {
      const game = new Game(generateTerritories());
      assert.deepStrictEqual(game.reinforce('india', 1), {
        status: false,
        error: 'This stage does not support reinforcement'
      });
    });

    it('should give true status when reinforce is done', () => {
      const india = generateTerritories().india;
      const game = new Game({ india });
      game.addPlayer('Player1');
      game.claimTerritory('india');
      assert.deepStrictEqual(game.reinforce('india', 1), {
        status: true,
        leftMilitaryCount: 48,
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
      assert.deepStrictEqual(game.claimTerritory('india'), {
        status: true,
        color: 'red',
        leftMilitaryCount: 49
      });
    });

    it('should give error message if it is claimed', () => {
      assert.deepStrictEqual(game.claimTerritory('india'), {
        status: false,
        error: 'territory already occupied'
      });
    });

    it('should give error message if it is not in claim stage', () => {
      game.updateStage();
      assert.deepStrictEqual(game.claimTerritory('india'), {
        status: false,
        error: 'wrong stage'
      });
    });
  });

  context('updateCurrentPlayer', () => {
    const game = new Game(generateTerritories());
    game.addPlayer('Player1');
    game.addPlayer('Player2');
    it('should update currentPlayer from Player1 to Player2', () => {
      assert.strictEqual(game.updateCurrentPlayer(), 'yellow');
    });
  });
});
