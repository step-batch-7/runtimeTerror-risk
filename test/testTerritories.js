const generateCountries = require('../src/countries');
const Country = require('../src/country');
const assert = require('chai').assert;

describe('generateCountries', function() {
  it('Should give all the countries with respective details', function() {
    const india = generateCountries().india;
    assert.instanceOf(india, Country);
  });
});
