const Territory = require('./territory');

const territoriesList = require('../data/territories.json');

const generateTerritories = function() {
  const territories = {};
  const allTerritoriesData = Object.entries(territoriesList);
  allTerritoriesData.forEach(([territoryId, { name, neighbors }]) => {
    territories[territoryId] = new Territory(territoryId, neighbors, name);
  });
  return territories;
};

module.exports = generateTerritories;
