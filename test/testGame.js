const { assert } = require('chai');
const Game = require('../src/game');
const Player = require('../src/player');
const generateTerritories = require('../src/territories');

describe('Game', function() {
  const { india, china } = generateTerritories();
  it('should give instance of game class', function() {
    const game = new Game({ india }, 3);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game({ india }, 3);
      game.addPlayer('John');
      const expected = {
        currentPlayer: { name: 'John', leftMilitaryCount: 35, territories: [] },
        currentPlayerId: 1,
        currentStage: 1,
        currentPhase: 0,
        activities: [{ msg: 'John has joined.' }],
        territories: {
          india: {
            id: 'india',
            name: 'India',
            occupiedBy: undefined,
            neighborsName: ['siam', 'china', 'afghanistan', 'middleEast'],
            militaryUnits: 0
          }
        }
      };
      assert.deepStrictEqual(game.status, expected);
    });
  });

  context('addPlayer', () => {
    it('should add a new player in player list', () => {
      const game = new Game({ india, china });
      assert.strictEqual(game.addPlayer('Player1'), 1);
    });
  });

  context('reinforce', () => {
    it('should give false status when the stage is not 2 ', () => {
      const game = new Game({ india, china }, 3);
      assert.deepStrictEqual(game.reinforce('india', 1), {
        status: false,
        error: 'Wrong stage or phase'
      });
    });

    it('should give false status when territory is not current player territory', () => {
      const { india, china } = generateTerritories();
      const game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      assert.deepStrictEqual(game.reinforce('china', 1), {
        status: false,
        error: 'This is not your territory'
      });
    });

    it('should give true status when reinforce is done', () => {
      const india = generateTerritories().india;
      const game = new Game({ india }, 1);
      game.addPlayer('Player1');
      game.claim('india');
      assert.deepStrictEqual(game.reinforce('india', 1), {
        status: true,
        leftMilitaryCount: 43,
        territoryMilitaryCount: 2
      });
    });
  });

  context('claim', () => {
    const game = new Game({ india, china }, 1);
    game.addPlayer('Player1');
    it('should claim territory if it is unclaimed', () => {
      assert.deepStrictEqual(game.claim('india'), {
        status: true,
        leftMilitaryCount: 44
      });
    });

    it('should give error message if it is claimed', () => {
      assert.deepStrictEqual(game.claim('india'), {
        status: false,
        error: 'Territory already claimed'
      });
    });

    it('should give error message if it is not in claim stage', () => {
      game.claim('china');
      assert.deepStrictEqual(game.claim('india'), {
        status: false,
        error: 'wrong stage'
      });
    });
  });
});
