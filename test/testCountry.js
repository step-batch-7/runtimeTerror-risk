const Country = require('../src/country');
const {assert} = require('chai');

describe('Country', function() {
  it('Should give the instance of country class', function() {
    const country = new Country('india', ['china']);
    assert.instanceOf(country, Country);
  });

  context('isOccupiedBy', function() {
    it('Should give true when the given country is occupiedBy that player', function() {
      const country = new Country('india', ['china']);
      assert.isTrue(country.isOccupiedBy('Player1'));
    });
    it('Should give false when the given country not occupiedBy that player', function() {
      const country = new Country('india', ['china']);
      assert.isFalse(country.isOccupiedBy('Player2'));
    });
  });

  context('deployMilitary', function() {
    it('Should give the incremented military unit', function() {
      const country = new Country('india', ['china']);
      assert.strictEqual(country.deployMilitary(1), 1);
    });
  });
});
