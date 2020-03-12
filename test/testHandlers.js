const request = require('supertest');
const { app } = require('../src/router');
const Controller = require('../src/controller');

describe('Handlers', () => {
  context('Requests for static files', () => {
    it('Should serve the index.html page', done => {
      request(app)
        .get('/index.html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8', done)
        .expect(/Host Game/);
    });

    it('Should serve the index.html page for /', done => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8', done)
        .expect(/Host Game/);
    });
  });

  context('Requests for game status', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });
    it('Should give remainingMilitaryCount in game status', done => {
      request(app)
        .get('/gameStatus')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect(/{"currentPlayer":{"name":"player1","leftMilitaryCount":40/);
    });

    it('Should give currentStage in game status', done => {
      request(app)
        .get('/gameStatus')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect(/{"currentPlayer":{"name":"player1","leftMilitaryCount":40,"territories":\[\]/);
    });

    it('Should tell bad request if cookie is not present', done => {
      request(app)
        .get('/gameStatus')
        .expect(400, done)
        .expect({ error: 'Game not found' });
    });

    it('Should tell bad request if invalid game id in cookie', done => {
      request(app)
        .get('/gameStatus')
        .set('Cookie', '_gameId=123')
        .expect(400, done)
        .expect({ error: 'Game not found' });
    });
  });

  context('Request for claim territory', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      controller.getGame(1000).addPlayer('player2');
      app.locals = { controller };
    });
    it('Should claim the given territory if the fields are valid', done => {
      request(app)
        .post('/performClaim')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ territory: 'india' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect({ status: true, leftMilitaryCount: 39 });
    });

    it('Should respond with "Bad Request" if the fields are invalid', done => {
      request(app)
        .post('/performClaim')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ country: 'india' })
        .expect(400, done);
    });
  });

  context('performReinforcement', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(1);
      controller.getGame(1000).addPlayer('player1');
      controller.getGame(1000).claimTerritory('india');
      controller.getGame(1000).updateStage();
      app.locals = { controller };
    });

    it('Should reinforce the given territory if the reinforcement is valid', done => {
      request(app)
        .post('/reinforcement')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ territory: 'india', militaryCount: 1 })
        .expect(200, done)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({
          status: true,
          leftMilitaryCount: 43,
          territoryMilitaryCount: 2
        });
    });

    it('Should respond with "Bad Request" if the fields are invalid', done => {
      request(app)
        .post('/reinforcement')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ country: 'india' })
        .expect(400, done);
    });
  });

  context('JoinGame', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });
    it('Should join the game for valid gameId', done => {
      request(app)
        .post('/joinGame')
        .send({ playerName: 'india', gameId: 1000 })
        .expect(202)
        .expect('Set-Cookie', '_gameId=1000; Path=/,_playerId=2; Path=/')
        .expect({ joinStatus: true }, done);
    });

    it('Should not join the game for invalid gameId', done => {
      request(app)
        .post('/joinGame')
        .send({ playerName: 'india', gameId: 3 })
        .expect(200)
        .expect({ joinStatus: false, errorMsg: 'Invalid Game Id(3)' }, done);
    });
    it('Should not join the game for invalid gameId', done => {
      app.locals.controller.join(1000, 'player2');
      request(app)
        .post('/joinGame')
        .send({ playerName: 'india', gameId: 1000 })
        .expect(200)
        .expect({ joinStatus: false, errorMsg: 'Game already started' }, done);
    });
  });

  context('HostGame', () => {
    beforeEach(() => {
      const controller = new Controller();
      app.locals = { controller };
    });
    it('Should host a new game', done => {
      request(app)
        .post('/hostGame')
        .send({ playerName: 'india', numOfPlayers: 2 })
        .expect(202)
        .expect('Set-Cookie', '_gameId=1000; Path=/,_playerId=1; Path=/')
        .expect({ gameId: 1000 }, done);
    });
  });

  context('Request for game details', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });
    it('Should give the gameId and number of players of a perticular game', done => {
      request(app)
        .get('/gameDetails')
        .set('Cookie', '_gameId=1000;')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect({ gameId: '1000', numOfPlayers: 2 });
    });
  });

  context('Request for player details', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });
    it('Should give the number of joined players and status about starting of a perticular game', done => {
      request(app)
        .get('/playersDetails')
        .set('Cookie', '_gameId=1000;')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect({
          hasGameStarted: false,
          playersDetails: {
            1: {
              name: 'player1',
              leftMilitaryCount: 40,
              territories: []
            }
          }
        });
    });
  });

  context('authorizeGame', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });

    it('Should claim the given territory if the requested player is current player', done => {
      app.locals.controller.getGame(1000).addPlayer('player2');
      request(app)
        .post('/performClaim')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ territory: 'india' })
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect({ status: true, leftMilitaryCount: 39 });
    });

    it('Should give 406 when game is not started', done => {
      request(app)
        .post('/performClaim')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .send({ territory: 'india' })
        .expect(406)
        .expect('Content-Type', 'application/json; charset=utf-8', done)
        .expect({ error: 'This is not your turn' });
    });

    it('Should give 406 when the requested player is not the current player', done => {
      request(app)
        .post('/reinforcement')
        .set('Cookie', '_gameId=1000;_playerId=2')
        .send({ territory: 'india', militaryCount: 1 })
        .expect(406, done)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect({ error: 'This is not your turn' });
    });
  });

  context('hasGameStarted', () => {
    beforeEach(() => {
      const controller = new Controller();
      controller.addGame(2);
      controller.getGame(1000).addPlayer('player1');
      app.locals = { controller };
    });

    it('Should redirect to the waiting page when the game is not started', done => {
      request(app)
        .get('/game.html')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .expect(302, done);
    });

    it('Should go to the next handler when the game is already started', done => {
      app.locals.controller.getGame(1000).addPlayer('player2');
      request(app)
        .get('/game.html')
        .set('Cookie', '_gameId=1000;_playerId=1')
        .expect(200, done);
    });
  });
});
