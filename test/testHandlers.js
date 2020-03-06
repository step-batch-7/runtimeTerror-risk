const request = require('supertest');
const {app} = require('../src/router');

describe('Handlers', () => {
  context('Requests for static files', () => {
    it('Should serve the index.html page', done => {
      request(app)
        .get('/index.html')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8', done)
        .expect(/\.\/scripts\/map\.js/);
    });
    it('Should serve the index.html page for /', done => {
      request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=UTF-8', done)
        .expect(/\.\/scripts\/map\.js/);
    });
  });
});
