const {assert} = require('chai');
const Controller = require('../src/controller');

describe('Controller', () => {
  context('addGame', () => {
    it('Should add a new game', () => {
      const controller = new Controller();
      assert.deepStrictEqual(controller.addGame(3), 1000);
    });
  });

  context('join', () => {
    it('Should join the existing game', () => {
      const controller = new Controller();
      controller.addGame(3);
      controller.getGame(1000).addPlayer('player1');
      assert.deepStrictEqual(controller.join(1000, 'player2'), 'forestgreen');
    });
  });
  context('isValid', () => {
    it('Should give true status if game is valid for join', () => {
      const controller = new Controller();
      controller.addGame(3);
      controller.getGame(1000).addPlayer('player1');
      assert.deepStrictEqual(controller.isValid(1000), {
        joinStatus: true,
        errorMsg: ''
      });
    });

    it('Should give false status if gameID is invalid for join', () => {
      const controller = new Controller();
      controller.addGame(2);
      assert.deepStrictEqual(controller.isValid(100), {
        joinStatus: false,
        errorMsg: 'Invalid Game Id(100)'
      });
    });

    it('Should give false status if game is already started', () => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      controller.join(1000, 'player2');
      assert.deepStrictEqual(controller.isValid(1000), {
        joinStatus: false,
        errorMsg: "You can't join this Game (1000)"
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
