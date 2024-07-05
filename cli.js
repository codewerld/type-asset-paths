const main = require('./index.js');

main()
  .then(() => console.log('Asset paths generated successfully'))
  .catch((error) => console.error('Error generating asset paths:', error));