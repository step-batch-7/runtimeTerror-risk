const Country = require('../src/country');
const {assert} = require('chai');

describe('Country', function() {
  it('Should give the instance of country class', function() {
    const country = new Country('india', ['china']);
    assert.instanceOf(country, Country);
  });
});
