const Country = require('./country');

const countriesList = {
  easternAustralia: ['westernAustralia', 'newGuinea'],
  indonesia: ['westernAustralia', 'siam', 'newGuinea'],
  newGuinea: ['indonesia', 'westernAustralia', 'easternAustralia'],
  alaska: ['kamchatka', 'northwestTerritory', 'alberta'],
  ontario: [
    'northwestTerritory',
    'alberta',
    'westernUs',
    'easternUs',
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
  iceland: ['greenland', 'scandinavia', 'uk'],
  uk: ['iceland', 'scandinavia', 'northernEurope', 'westernEurope'],
  scandinavia: ['iceland', 'uk', 'northernEurope', 'ukraine'],
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
  westernEurope: ['uk', 'northernEurope', 'southernEurope', 'northAfrica'],
  northernEurope: [
    'scandinavia',
    'uk',
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
  easternUs: ['quebec', 'ontario', 'westernUs', 'centralAmerica'],
  westernUs: ['alberta', 'ontario', 'easternUs', 'centralAmerica'],
  quebec: ['greenland', 'ontario', 'easternUs'],
  centralAmerica: ['venezuela', 'easternUs', 'westernUs'],
  peru: ['brazil', 'venezuela', 'argentina'],
  westernAustralia: ['easternAustralia', 'newGuinea', 'indonesia'],
  alberta: ['alaska', 'northwestTerritory', 'ontario', 'westernUs']
};

const generateCountries = () => {
  const countries = {};
  for (const country in countriesList) {
    countries[country] = new Country(country, countriesList[country]);
  }
  return countries;
};

module.exports = generateCountries;
