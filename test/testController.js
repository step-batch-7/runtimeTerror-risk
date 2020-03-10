const { assert } = require('chai');
const Controller = require('../src/controller');

describe('Controller', () => {
  context('addGame', () => {
    it('Should add a new game', () => {
      const controller = new Controller();
      assert.deepStrictEqual(controller.addGame('player1', 3), {
        gameId: 1000,
        playerId: 'indianred'
      });
    });
  });

  context('join', () => {
    it('Should join the existing game', () => {
      const controller = new Controller();
      controller.addGame('player1', 3);
      assert.deepStrictEqual(controller.join(1000, 'player2'), 'forestgreen');
    });
  });
  context('isValid', () => {
    it('Should give true status if game is valid for join', () => {
      const controller = new Controller();
      controller.addGame('player1', 2);
      assert.deepStrictEqual(controller.isValid(1000), {
        joinStatus: true,
        errorMsg: ''
      });
    });

    it('Should give false status if gameID is invalid for join', () => {
      const controller = new Controller();
      controller.addGame('player1', 2);
      assert.deepStrictEqual(controller.isValid(100), {
        joinStatus: false,
        errorMsg: 'Invalid Game Id(100)'
      });
    });
  });

  context('getGame', () => {
    it('Should give game instance of given given gameId', () => {
      const controller = new Controller();
      controller.addGame('player1', 2);
      assert.deepStrictEqual(controller.getGame(1000), {});
    });
  });
});
