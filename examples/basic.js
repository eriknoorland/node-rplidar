const RPLidar = require('../dist/index.cjs');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', console.log);

lidar.init()
  .then(lidar.scan);
