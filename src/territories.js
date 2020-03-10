const Territory = require('./territory');

const territoriesList = {
  easternAustralia: {
    name: 'Eastern Australia',
    neighbors: ['westernAustralia', 'newGuinea']
  },
  indonesia: {
    name: 'Indonesia',
    neighbors: ['westernAustralia', 'siam', 'newGuinea']
  },
  newGuinea: {
    name: 'New Guinea',
    neighbors: ['indonesia', 'westernAustralia', 'easternAustralia']
  },
  alaska: {
    name: 'Alaska',
    neighbors: ['kamchatka', 'northwestTerritory', 'alberta']
  },
  ontario: {
    name: 'Ontario',
    neighbors: [
      'northwestTerritory',
      'alberta',
      'westernUS',
      'easternUS',
      'quebec',
      'greenland'
    ]
  },
  northwestTerritory: {
    name: 'Northwest Territory',
    neighbors: ['greenland', 'ontario', 'alberta', 'alaska']
  },
  venezuela: {
    name: 'Venezuela',
    neighbors: ['centralAmerica', 'brazil', 'peru']
  },
  madagascar: {name: 'Madagascar', neighbors: ['southAfrica', 'eastAfrica']},
  northAfrica: {
    name: 'North Africa',
    neighbors: [
      'brazil',
      'westernEurope',
      'southernEurope',
      'egypt',
      'eastAfrica',
      'congo'
    ]
  },
  greenland: {
    name: 'Greenland',
    neighbors: ['northwestTerritory', 'ontario', 'quebec', 'iceland']
  },
  iceland: {
    name: 'Iceland',
    neighbors: ['greenland', 'scandinavia', 'greatBritain']
  },
  greatBritain: {
    name: 'Great Britain',
    neighbors: ['iceland', 'scandinavia', 'northernEurope', 'westernEurope']
  },
  scandinavia: {
    name: 'Scandinavia',
    neighbors: ['iceland', 'greatBritain', 'northernEurope', 'ukraine']
  },
  japan: {name: 'Japan', neighbors: ['kamchatka', 'mongolia']},
  yakutsk: {name: 'Yakutsk', neighbors: ['siberia', 'irkutsk', 'kamchatka']},
  kamchatka: {
    name: 'Kamchatka',
    neighbors: ['alaska', 'japan', 'mongolia', 'irkutsk', 'yakutsk']
  },
  siberia: {
    name: 'Siberia',
    neighbors: ['yakutsk', 'irkutsk', 'mongolia', 'china', 'ural']
  },
  ural: {
    name: 'Ural',
    neighbors: ['ukraine', 'afghanistan', 'china', 'siberia']
  },
  afghanistan: {
    name: 'Afghanistan',
    neighbors: ['ukraine', 'ural', 'china', 'india', 'middleEast']
  },
  middleEast: {
    name: 'Middle East',
    neighbors: [
      'southernEurope',
      'ukraine',
      'afghanistan',
      'india',
      'eastAfrica',
      'egypt'
    ]
  },
  india: {
    name: 'India',
    neighbors: ['siam', 'china', 'afghanistan', 'middleEast']
  },
  siam: {name: 'Siam', neighbors: ['india', 'china', 'indonesia']},
  china: {
    name: 'China',
    neighbors: ['siam', 'india', 'afghanistan', 'ural', 'siberia', 'mongolia']
  },
  mongolia: {
    name: 'Mongolia',
    neighbors: ['japan', 'kamchatka', 'irkutsk', 'siberia', 'china']
  },
  irkutsk: {
    name: 'Irkutsk',
    neighbors: ['yakutsk', 'siberia', 'mongolia', 'kamchatka']
  },
  ukraine: {
    name: 'Ukraine',
    neighbors: [
      'ural',
      'afghanistan',
      'middleEast',
      'southernEurope',
      'northernEurope',
      'scandinavia'
    ]
  },
  southernEurope: {
    name: 'Southern Europe',
    neighbors: [
      'northernEurope',
      'westernEurope',
      'northAfrica',
      'egypt',
      'middleEast',
      'ukraine'
    ]
  },
  westernEurope: {
    name: 'Western Europe',
    neighbors: [
      'greatBritain',
      'northernEurope',
      'southernEurope',
      'northAfrica'
    ]
  },
  northernEurope: {
    name: 'Northern Europe',
    neighbors: [
      'scandinavia',
      'greatBritain',
      'westernEurope',
      'southernEurope',
      'ukraine'
    ]
  },
  egypt: {
    name: 'Egypt',
    neighbors: ['southernEurope', 'northAfrica', 'eastAfrica', 'middleEast']
  },
  eastAfrica: {
    name: 'East Africa',
    neighbors: [
      'madagascar',
      'southAfrica',
      'congo',
      'northAfrica',
      'egypt',
      'middleEast'
    ]
  },
  congo: {
    name: 'Congo',
    neighbors: ['northAfrica', 'eastAfrica', 'southAfrica']
  },
  southAfrica: {
    name: 'South Africa',
    neighbors: ['madagascar', 'eastAfrica', 'congo']
  },
  brazil: {
    name: 'Brazil',
    neighbors: ['northAfrica', 'peru', 'argentina', 'venezuela']
  },
  argentina: {name: 'Argentina', neighbors: ['peru', 'brazil']},
  easternUS: {
    name: 'Eastern US',
    neighbors: ['quebec', 'ontario', 'westernUS', 'centralAmerica']
  },
  westernUS: {
    name: 'Western US',
    neighbors: ['alberta', 'ontario', 'easternUS', 'centralAmerica']
  },
  quebec: {name: 'Quebec', neighbors: ['greenland', 'ontario', 'easternUS']},
  centralAmerica: {
    name: 'Central America',
    neighbors: ['Venezuela', 'easternUS', 'westernUS']
  },
  peru: {name: 'Peru', neighbors: ['brazil', 'venezuela', 'argentina']},
  westernAustralia: {
    name: 'Western Australia',
    neighbors: ['Eastern Australia', 'newGuinea', 'indonesia']
  },
  alberta: {
    name: 'Alberta',
    neighbors: ['alaska', 'northwestTerritory', 'ontario', 'westernUS']
  }
};

const generateTerritories = function() {
  const territories = {};
  const allTerritoriesData = Object.entries(territoriesList);
  allTerritoriesData.forEach(([territoryId, {name, neighbors}]) => {
    territories[territoryId] = new Territory(territoryId, neighbors, name);
  });
  return territories;
};

module.exports = generateTerritories;
