const {assert} = require('chai');
const Game = require('../src/game');
const Territory = require('../src/territory');
const generateTerritories = require('../src/territories');

describe('Game', function() {
  const {india, china} = generateTerritories();
  it('should give instance of game class', function() {
    const game = new Game({india}, 3);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game({india}, 3);
      game.addPlayer('John');
      const expected = {
        currentPlayer: {
          name: 'John',
          leftMilitaryCount: 35,
          territories: [],
          id: 1
        },
        currentStage: 1,
        currentPhase: 1,
        activities: [{msg: 'John has joined.'}],
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
      const game = new Game({india, china});
      assert.strictEqual(game.addPlayer('Player1'), 1);
    });
  });

  context('reinforce', () => {
    it('should give false status when the stage is not 2 ', () => {
      const game = new Game({india, china}, 3);
      assert.deepStrictEqual(game.reinforce('india', 1), {
        isDone: false,
        error: 'Wrong stage or phase'
      });
    });

    it('should give false status when territory is not current player territory', () => {
      const {india, china} = generateTerritories();
      const game = new Game({india, china}, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      assert.deepStrictEqual(game.reinforce('china', 1), {
        isDone: false,
        error: 'This is not your territory'
      });
    });

    it('should give true status when reinforce is done', () => {
      const india = generateTerritories().india;
      const game = new Game({india}, 1);
      game.addPlayer('Player1');
      game.claim('india');
      assert.deepStrictEqual(game.reinforce('india', 1), {
        isDone: true,
        leftMilitaryCount: 43,
        territoryMilitaryCount: 2
      });
    });
  });

  context('claim', () => {
    const game = new Game({india, china}, 1);
    game.addPlayer('Player1');
    it('should claim territory if it is unclaimed', () => {
      assert.deepStrictEqual(game.claim('india'), {
        isDone: true,
        leftMilitaryCount: 44
      });
    });

    it('should give error message if it is claimed', () => {
      assert.deepStrictEqual(game.claim('india'), {
        isDone: false,
        error: 'Territory already claimed'
      });
    });

    it('should give error message if it is not in claim stage', () => {
      game.claim('china');
      assert.deepStrictEqual(game.claim('india'), {
        isDone: false,
        error: 'wrong stage'
      });
    });
  });

  context('updatePhase', () => {
    it('should update the current Phase', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      game.updateStage();
      game.updateStage();
      assert.deepStrictEqual(game.updatePhase(), 2);
    });

    it('should not update the current Phase when the stage is not 3', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      game.updateStage();
      assert.deepStrictEqual(game.updatePhase(), 1);
    });
  });

  context('isActionValidBy', () => {
    it('should give true when the action is valid by the given user', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      assert.isTrue(game.isActionValidBy(1));
    });

    it('should give true when the action is not valid by the given user', () => {
      const game = new Game({india, china}, 2);
      game.addPlayer('Player1');
      assert.isFalse(game.isActionValidBy(1));
    });
  });

  context('numOfPlayers', () => {
    it('should give the total number of the game', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      assert.strictEqual(game.numOfPlayers, 1);
    });
  });

  context('hasStarted', () => {
    it('should give true when game is started', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      assert.isTrue(game.hasStarted);
    });

    it('should give false when the game is not started', () => {
      const game = new Game({india, china}, 2);
      game.addPlayer('Player1');
      assert.isFalse(game.hasStarted);
    });
  });

  context('servePlayersDetails', () => {
    it('should give details of all players', () => {
      const game = new Game({india, china}, 1);
      game.addPlayer('Player1');
      assert.deepStrictEqual(game.getPlayersDetails(), {
        1: {leftMilitaryCount: 45, name: 'Player1', territories: []}
      });
    });
  });

  context('InitiateAttack', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({india, china}, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
    });

    it('Should initiate attack if territory is of current player', () => {
      game.deployMilitaryTo(india, 10);
      assert.deepStrictEqual(game.initiateAttack('india'), {
        status: true,
        error: '',
        neighbors: ['china']
      });
    });
    it('Should not initiate attack if military units is equal to one', () => {
      assert.deepStrictEqual(game.initiateAttack('india'), {
        status: false,
        error: 'You don’t have enough military units'
      });
    });

    it('Should not initiate attack if territory is not of current player', () => {
      assert.deepStrictEqual(game.initiateAttack('china'), {
        status: false,
        error: 'Invalid Territory for Attack'
      });
    });
  });

  context('AddDefenderToAttack', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({india, china}, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
    });

    it('Should not add defender if attacking, defending territories are same player', () => {
      assert.deepStrictEqual(game.addDefenderToAttack('india'), {
        status: false,
        error: "You can't attack this territory"
      });
    });
    it('Should add defender to attack for valid defender', () => {
      assert.deepStrictEqual(game.addDefenderToAttack('china'), {
        status: true,
        error: ''
      });
    });
  });
});
