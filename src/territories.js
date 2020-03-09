const Territory = require('./territory');

const territoriesList = {
  easternAustralia: ['westernAustralia', 'newGuinea'],
  indonesia: ['westernAustralia', 'siam', 'newGuinea'],
  newGuinea: ['indonesia', 'westernAustralia', 'easternAustralia'],
  alaska: ['kamchatka', 'northwestTerritory', 'alberta'],
  ontario: [
    'northwestTerritory',
    'alberta',
    'westernUS',
    'easternUS',
    'quebec',
    'greenland'
  ],
  northwestTerritory: ['greenland', 'ontario', 'alberta', 'alaska'],
  venezuela: ['centralAmerica', 'brazil', 'peru'],
  madagascar: ['southAfrica', 'eastAfrica'],
  northAfrica: [
    'brazil',
    'westernEurope',
    'southernEurope',
    'egypt',
    'eastAfrica',
    'congo'
  ],
  greenland: ['northwestTerritory', 'ontario', 'quebec', 'iceland'],
  iceland: ['greenland', 'scandinavia', 'greatBritain'],
  greatBritain: ['iceland', 'scandinavia', 'northernEurope', 'westernEurope'],
  scandinavia: ['iceland', 'greatBritain', 'northernEurope', 'ukraine'],
  japan: ['kamchatka', 'mongolia'],
  yakutsk: ['siberia', 'irkutsk', 'kamchatka'],
  kamchatka: ['alaska', 'japan', 'mongolia', 'irkutsk', 'yakutsk'],
  siberia: ['yakutsk', 'irkutsk', 'mongolia', 'china', 'ural'],
  ural: ['ukraine', 'afghanistan', 'china', 'siberia'],
  afghanistan: ['ukraine', 'ural', 'china', 'india', 'middleEast'],
  middleEast: [
    'southernEurope',
    'ukraine',
    'afghanistan',
    'india',
    'eastAfrica',
    'egypt'
  ],
  india: ['siam', 'china', 'afghanistan', 'middleEast'],
  siam: ['india', 'china', 'indonesia'],
  china: ['siam', 'india', 'afghanistan', 'ural', 'siberia', 'mongolia'],
  mongolia: ['japan', 'kamchatka', 'irkutsk', 'siberia', 'china'],
  irkutsk: ['yakutsk', 'siberia', 'mongolia', 'kamchatka'],
  ukraine: [
    'ural',
    'afghanistan',
    'middleEast',
    'southernEurope',
    'northernEurope',
    'scandinavia'
  ],
  southernEurope: [
    'northernEurope',
    'westernEurope',
    'northAfrica',
    'egypt',
    'middleEast',
    'ukraine'
  ],
  westernEurope: [
    'greatBritain',
    'northernEurope',
    'southernEurope',
    'northAfrica'
  ],
  northernEurope: [
    'scandinavia',
    'greatBritain',
    'westernEurope',
    'southernEurope',
    'ukraine'
  ],
  egypt: ['southernEurope', 'northAfrica', 'eastAfrica', 'middleEast'],
  eastAfrica: [
    'madagascar',
    'southAfrica',
    'congo',
    'northAfrica',
    'egypt',
    'middleEast'
  ],
  congo: ['northAfrica', 'eastAfrica', 'southAfrica'],
  southAfrica: ['madagascar', 'eastAfrica', 'congo'],
  brazil: ['northAfrica', 'peru', 'argentina', 'venezuela'],
  argentina: ['peru', 'brazil'],
  easternUS: ['quebec', 'ontario', 'westernUS', 'centralAmerica'],
  westernUS: ['alberta', 'ontario', 'easternUS', 'centralAmerica'],
  quebec: ['greenland', 'ontario', 'easternUS'],
  centralAmerica: ['venezuela', 'easternUS', 'westernUS'],
  peru: ['brazil', 'venezuela', 'argentina'],
  westernAustralia: ['easternAustralia', 'newGuinea', 'indonesia'],
  alberta: ['alaska', 'northwestTerritory', 'ontario', 'westernUS']
};

const generateTerritories = () => {
  const territories = {};
  for (const territory in territoriesList) {
    territories[territory] = new Territory(
      territory,
      territoriesList[territory]
    );
  }
  return territories;
};

module.exports = generateTerritories;
