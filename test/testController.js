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

  context('getGame', () => {
    it('Should give game instance of given given gameId', () => {
      const controller = new Controller();
      controller.addGame('player1', 2);
      assert.deepStrictEqual(controller.getGame(1000), {});
    });
  });
});
