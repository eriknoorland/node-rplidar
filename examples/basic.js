const RPLidar = require('../src/RPLidar');
const lidar = RPLidar('/dev/tty.usbserial-0001');

lidar.on('data', console.log);

lidar
  .init()
  .then(lidar.health)
  .then(lidar.scan)
  .catch(console.log);
