const RPLidar = require('../src/RPLidar');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', console.log);

lidar.init()
  .then(lidar.scan);
