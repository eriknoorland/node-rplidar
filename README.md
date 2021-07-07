# node-rplidar
A Node module to communicate with the RPLidar over USB.

## installation
```
npm install git+https://git@github.com/eriknoorland/node-rplidar.git
```

## usage
Always make sure to call lidar.health before starting a new scan.
```javascript
const RPLidar = require('node-rplidar');
const lidar = RPLidar('/dev/ttyUSB0');

lidar.on('data', data => {
  console.log(data);
});

lidar
  .init()
  .then(lidar.health)
  .then(lidar.scan);
```
