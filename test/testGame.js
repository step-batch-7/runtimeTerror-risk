const { assert } = require('chai');
const Game = require('../src/game');
const Territory = require('../src/territory');
const Player = require('../src/player');
const sinon = require('sinon');
const generateTerritories = require('../src/territories');

describe('Game', function() {
  const { india, china, alberta, ontario, alaska } = generateTerritories();

  it('should give instance of game class', function() {
    const game = new Game({ india }, 3);
    assert.instanceOf(game, Game);
  });

  context('status', () => {
    it('should give current status of the game', () => {
      const game = new Game({ india }, 3);
      game.addPlayer('John');
      const expected = {
        currentPlayer: {
          name: 'John',
          leftMilitaryCount: 35,
          id: 1
        },
        currentStage: 1,
        currentPhase: 1,
        activities: [{ msg: 'John has joined.' }],
        territories: {
          india: {
            id: 'india',
            name: 'India',
            occupiedBy: undefined,
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
        isDone: false,
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
        isDone: false,
        error: 'This is not your territory'
      });
    });

    it('should give true status when reinforce is done', () => {
      const india = generateTerritories().india;
      const game = new Game({ india }, 1);
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
    const game = new Game({ india, china }, 1);
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
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      game.updateStage();
      game.updateStage();
      assert.deepStrictEqual(game.updatePhase(), 2);
    });

    it('should not update the current Phase when the stage is not 3', () => {
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      game.updateStage();
      assert.deepStrictEqual(game.updatePhase(), 1);
    });
  });

  context('isActionValidBy', () => {
    it('should give true when the action is valid by the given user', () => {
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      assert.isTrue(game.isActionValidBy(1));
    });

    it('should give true when the action is not valid by the given user', () => {
      const game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      assert.isFalse(game.isActionValidBy(1));
    });
  });

  context('numOfPlayers', () => {
    it('should give the total number of the game', () => {
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      assert.strictEqual(game.numOfPlayers, 1);
    });
  });

  context('hasStarted', () => {
    it('should give true when game is started', () => {
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      assert.isTrue(game.hasStarted);
    });

    it('should give false when the game is not started', () => {
      const game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      assert.isFalse(game.hasStarted);
    });
  });

  context('getPlayersDetails', () => {
    it('should give details of all players', () => {
      const game = new Game({ india, china }, 1);
      game.addPlayer('Player1');
      assert.deepStrictEqual(game.getPlayersDetails(), {
        1: { leftMilitaryCount: 45, name: 'Player1' }
      });
    });
  });

  context('isMine', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
    });
    it('should give true if territory is occupied by currentPlayer', () => {
      assert.isTrue(game.isMine('india'));
    });
    it('should give true if territory is occupied by currentPlayer', () => {
      assert.isFalse(game.isMine('china'));
    });
  });

  context('InitiateAttack', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
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

  context('AddDefender', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
    });

    it('Should not add defender if attacking, defending territories are same player', () => {
      assert.deepStrictEqual(game.addDefender('india'), {
        status: false,
        error: "You can't attack this territory"
      });
    });
    it('Should add defender to attack for valid defender', () => {
      assert.deepStrictEqual(game.addDefender('china'), {
        status: true,
        error: ''
      });
    });
  });

  context('isAttackGoingOn', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
    });
    it('should give true if attack is going on', () => {
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
      assert.isTrue(game.isAttackGoingOn());
    });
    it('should give true if attack is going on', () => {
      assert.isFalse(game.isAttackGoingOn());
    });
  });

  context('addAttackerMilitary', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
    });
    it('should add military unit to attacker military ', () => {
      assert.deepStrictEqual(game.addAttackerMilitary(1), {
        leftMilitaryUnit: 10,
        dice: 1
      });
    });
  });

  context('addDefenderMilitary', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      india = new Territory('india', ['china'], 'India');
      china = new Territory('china', ['india'], 'China');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
      game.addDefender('china');
    });
    it('should add military unit to defender military ', () => {
      assert.deepStrictEqual(game.addDefenderMilitary(1), {
        leftMilitaryUnit: 0,
        dice: 1
      });
    });
  });

  context('isValidDefender', () => {
    let game;
    let india;
    let china;
    beforeEach(() => {
      china = new Territory('china', ['india'], 'China');
      india = new Territory('india', ['china'], 'India');
      game = new Game({ india, china }, 2);
      game.addPlayer('Player1');
      game.addPlayer('Player2');
      game.claim('india');
      game.claim('china');
      game.deployMilitaryTo(india, 10);
      game.initiateAttack('india');
      game.addDefender('china');
    });
    it('should give true if the the defender is valid', () => {
      assert.isTrue(game.isValidDefender(2));
    });
    it('should give false if the the defender is not valid', () => {
      assert.isFalse(game.isValidDefender(1));
    });
  });

  context('getTerritoriesToFortify', function() {
    let game;
    this.beforeAll(function() {
      game = new Game({ alberta, ontario, alaska }, 2);
      sinon.stub(Player.prototype, 'hasDeployedAllMilitary').returns(true);
      game.addPlayer('player1');
      game.addPlayer('player2');
      game.claim('alberta');
      game.claim('ontario');
      game.claim('alaska');
      game.reinforce('alberta', 1);
      game.updatePhase();
      game.updatePhase();
    });
    this.afterAll(function() {
      sinon.restore();
    });

    it('should give possible territoryIds and maxValidMilitary count to move', () => {
      const actualValue = game.getFortifyPossibilities('alberta');
      const expectedValue = {
        isAccepted: true,
        validTerritories: ['alaska'],
        maxValidMilitaryUnits: 1
      };
      assert.deepStrictEqual(actualValue, expectedValue);
    });

    it('should give error if the selected territory is not occupied by current player', () => {
      const actualValue = game.getFortifyPossibilities('ontario');
      const expectedValue = {
        isAccepted: false,
        error: 'This is not your territory'
      };
      assert.deepStrictEqual(actualValue, expectedValue);
    });

    it('should give error if the selected territory has 1 military in it', () => {
      const actualValue = game.getFortifyPossibilities('alaska');
      const expectedValue = {
        isAccepted: false,
        error: 'Only 1 military in this territory'
      };
      assert.deepStrictEqual(actualValue, expectedValue);
    });

    it('should give possible territoryIds and maxValidMilitary count to move', () => {
      game.updatePhase();
      const actualValue = game.getFortifyPossibilities('alberta');
      const expectedValue = {
        isAccepted: false,
        error: 'Wrong stage or phase'
      };
      assert.deepStrictEqual(actualValue, expectedValue);
    });
  });
});
