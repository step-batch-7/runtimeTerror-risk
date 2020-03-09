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
      assert.strictEqual(game.addPlayer('Player1'), 'crimson');
    });
  });

  context('addActivity', () => {
    it('should add a new activity', () => {
      const game = new Game(['india', 'china']);
      assert.strictEqual(game.addActivity('New game started'), 1);
    });
  });

  context('performReinforcement', () => {
    it('should give false status when the stage is not 2 ', () => {
      const game = new Game(generateTerritories());
      assert.deepStrictEqual(game.performReinforcement('india', 1), {
        status: false,
        error: 'wrong stage or phase'
      });
    });

    it('should give false status when territory is not current player territory', () => {
      const { india, china } = generateTerritories();
      const game = new Game({
        india,
        china
      });
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.performClaim('india');
      game.performClaim('china');
      assert.deepStrictEqual(game.performReinforcement('china', 1), {
        status: false,
        error: 'This is not your territory'
      });
    });

    it('should give true status when performReinforcement is done', () => {
      const india = generateTerritories().india;
      const game = new Game({ india });
      game.addPlayer('Player1');
      game.performClaim('india');
      assert.deepStrictEqual(game.performReinforcement('india', 1), {
        status: true,
        leftMilitaryCount: 18,
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

  context('performClaim', () => {
    const game = new Game(generateTerritories());
    game.addPlayer('Player1');
    it('should claim territory if it is unclaimed', () => {
      assert.deepStrictEqual(game.performClaim('india'), {
        status: true,
        color: 'crimson',
        leftMilitaryCount: 19
      });
    });

    it('should give error message if it is claimed', () => {
      assert.deepStrictEqual(game.performClaim('india'), {
        status: false,
        error: 'Territory already claimed'
      });
    });

    it('should give error message if it is not in claim stage', () => {
      game.updateStage();
      assert.deepStrictEqual(game.performClaim('india'), {
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
      assert.strictEqual(game.updateCurrentPlayer(), 'forestgreen');
    });
  });
});
