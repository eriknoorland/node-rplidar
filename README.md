# node-rplidar
A Node module to communicate with the RPLidar over USB.

## installation
```
npm install node-rplidar
```

## usage
Always make sure to call lidar.health before starting a new scan.
```javascript
const RPLidar = require('node-rplidar');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', (data) => {
  console.log(data);
});

lidar
  .init()
  .then(lidar.health)
  .then((health) => {
    console.log('health', health);

    // 0 = good, 1 = warning, 2 = error
    if (health.status === 0) {
      lidar.scan();
    }
  });
```
