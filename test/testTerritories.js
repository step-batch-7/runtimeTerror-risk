const generateTerritories = require('../src/territories');
const Territory = require('../src/territory');
const assert = require('chai').assert;

describe('generateCountries', function() {
  it('Should give all the countries with respective details', function() {
    const india = generateTerritories().india;
    assert.instanceOf(india, Territory);
  });
});
