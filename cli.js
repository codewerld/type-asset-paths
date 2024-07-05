const generateAssetPaths = require('./index.js');

generateAssetPaths()
  .then(() => console.log('Asset paths generated successfully'))
  .catch((error) => console.error('Error generating asset paths:', error));