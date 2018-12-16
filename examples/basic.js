const RPLidar = require('../src/RPLidar');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', (data) => {
  console.log(data);
});

lidar
  .init()
  .then(lidar.health)
  .then((health) => {
    console.log('health', health);

    if (health.status === 0) {
      lidar.scan();
    }
  });
