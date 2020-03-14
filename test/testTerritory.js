const { assert } = require('chai');
const Territory = require('../src/territory');

describe('Territory', function() {
  it('Should give the instance of Territory class', function() {
    const territory = new Territory('india', ['china']);
    assert.instanceOf(territory, Territory);
  });

  context('changeRuler', () => {
    it('should change the ruler of the territory', () => {
      const territory = new Territory('india', ['china']);
      territory.changeRuler(1);
      assert.strictEqual(territory.status.occupiedBy, 1);
    });
  });

  context('isOccupied', () => {
    it('should give true for occupied territory', () => {
      const territory = new Territory('india', ['china']);
      territory.changeRuler('red');
      assert.isTrue(territory.isOccupied());
    });

    it('should give false for unoccupied territory', () => {
      const territory = new Territory('india', ['china']);
      assert.isFalse(territory.isOccupied());
    });
  });

  context('isOccupiedBy', function() {
    it('Should give true when the given territory is occupiedBy that player', function() {
      const territory = new Territory('india', ['china']);
      territory.changeRuler('red');
      assert.isTrue(territory.isOccupiedBy('red'));
    });
    it('Should give false when the given territory not occupiedBy that player', function() {
      const territory = new Territory('india', ['china']);
      assert.isFalse(territory.isOccupiedBy('Player2'));
    });
  });

  context('deployMilitary', function() {
    it('Should give the incremented military unit', function() {
      const territory = new Territory('india', ['china']);
      territory.deployMilitary(1);
      assert.strictEqual(territory.status.militaryUnits, 1);
    });
  });

  context('status', function() {
    it('Should give status of the territory', function() {
      const territory = new Territory('india', ['china'], 'India');
      assert.deepStrictEqual(territory.status, {
        id: 'india',
        name: 'India',
        occupiedBy: undefined,
        militaryUnits: 0
      });
    });
  });
});
