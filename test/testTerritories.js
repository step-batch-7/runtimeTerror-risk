const generateTerritories = require('../src/territories');
const Territory = require('../src/territory');
const {assert} = require('chai');

describe('GenerateTerritories', function() {
  it('Should give all the territories with respective details', () => {
    const {india} = generateTerritories();
    assert.instanceOf(india, Territory);
  });
});
