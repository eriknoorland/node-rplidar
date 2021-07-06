const RPLidar = require('../src/RPLidar');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', (data) => {
  console.log(data);
});

lidar
  .init()
  // .then(lidar.info)
  // .then((info) => {
  //   console.log({ info });
  //   return Promise.resolve();
  // })
  .then(lidar.health)
  .then((health) => {
    console.log({ health });

    if (health.status !== 0) {
      return Promise.reject('health check failed');
    }

    return Promise.resolve();
  })
  .then(lidar.scan)
  .catch(console.log);
