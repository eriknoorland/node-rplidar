const EventEmitter = require('events');
const SerialPort = require('serialport');
const Parser = require('./Parser');
const Request = require('./Request');
const State = require('./State');

/**
 * RPLidar
 * @param {String} path
 * @return {Object}
 */
const RPLidar = path => {
  const eventEmitter = new EventEmitter();

  let state = State.IDLE;
  let parser;
  let port;

  /**
   * Init
   * @return {Promise}
   */
  function init() {
    return new Promise((resolve, reject) => {
      if (port) {
        setTimeout(reject, 0);
      }

      port = new SerialPort(path, { baudRate: 115200 }, error => {
        if (error) {
          reject(error);
        }
      });

      parser = port.pipe(new Parser());

      parser.on('scan_data', (data) => {
        eventEmitter.emit('data', data);
      });

      port.on('error', error => eventEmitter.emit('error', error));
      port.on('disconnect', () => eventEmitter.emit('disconnect'));
      port.on('close', () => eventEmitter.emit('close'));
      port.on('open', onPortOpen.bind(null, resolve, reject));
    });
  }

  /**
   * Health
   * @return {Promise}
   */
  function health() {
    state = State.PROCESSING;
    port.write(Request.GET_HEALTH);

    return new Promise((resolve, reject) => {
      parser.once('health', healthStatus => {
        const { status, error } = healthStatus;

        state = State.IDLE;

        // 0 = good
        // 1 = warning
        // 2 = error
        if (status !== 0) {
          const type = status === 1 ? 'warning' : 'error';

          reject(`Health check failed with ${type} code ${error}`);
        }

        resolve(healthStatus);
      });
    });
  }

  /**
   * Info
   * @return {Promise}
   */
  function info() {
    state = State.PROCESSING;
    port.write(Request.GET_INFO);

    return new Promise(resolve => {
      parser.once('info', info => {
        resolve(info);
        state = State.IDLE;
      });
    });
  }

  /**
   * Scan
   * @return {Promise}
   */
  async function scan() {
    try {
      await health();
    } catch(error) {
      return Promise.reject(error);
    }

    port.set({ dtr: false }, error => {});

    const promise = new Promise(resolve => setTimeout(resolve), 0);

    promise.then(() => {
      state = State.PROCESSING;
      port.write(Request.SCAN);

      return new Promise(resolve => {
        parser.once('scan_start', () => {
          state = State.SCANNING;
          resolve();
        });
      });
    });

    return promise;
  }

  /**
   * Stop
   * @return {Promise}
   */
  function stop() {
    port.write(Request.STOP);

    return new Promise(resolve => {
      state = State.IDLE;
      setTimeout(resolve, 10);
    });
  }

  /**
   * Reset
   * @return {Promise}
   */
  function reset() {
    port.write(Request.RESET);

    return new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  /**
   * Port open event handler
   * @param {Function} resolve
   */
  function onPortOpen(resolve, reject) {
    port.flush(error => {
      if (error) {
        eventEmitter.emit('error', error);
        reject();
        return;
      }

      state = State.IDLE;
      resolve();
    });
  }

  return {
    init,
    health,
    info,
    scan,
    stop,
    reset,
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
  };
};

module.exports = RPLidar;
