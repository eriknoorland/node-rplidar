const EventEmitter = require('events');
const SerialPort = require('serialport');
const Parser = require('./Parser');
const NewParser = require('./NewParser');
const MotorState = require('./MotorState');
const Request = require('./Request');
const State = require('./State');

/**
 * RPLidar
 * @param {String} path
 * @return {Object}
 */
const RPLidar = (path) => {
  const eventEmitter = new EventEmitter();

  let hasDoneHealthCheck = false;
  let state = State.IDLE;
  let motorState = MotorState.OFF;
  let parser;
  let port;

  /**
   * Constructor
   */
  function constructor() {}

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
          reject();
        }
      });

      // parser = port.pipe(new Parser());
      parser = port.pipe(new NewParser());

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

    return new Promise(resolve => {
      parser.once('health', health => {
        hasDoneHealthCheck = true;
        state = State.IDLE;
        resolve(health);
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
  function scan() {
    if (!hasDoneHealthCheck) {
      return Promise.reject('A Health check must be performed first!');
    }

    let promise = new Promise(resolve => setTimeout(resolve));

    if(motorState === MotorState.OFF) {
      promise = startMotor();
    }

    return promise.then(() => {
      state = State.PROCESSING;
      port.write(Request.SCAN);

      return new Promise(resolve => {
        parser.once('scan_start', () => {
          state = State.SCANNING;
          resolve();
        });
      });
    });
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
      stopMotor();
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
   * Start motor
   * @return {Promise}
   */
  function startMotor() {
    port.set({ dtr: false }, () => {});
    motorState = MotorState.ON;

    return new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  /**
   * Stop motor
   */
  function stopMotor() {
    port.set({ dtr: true }, () => {});
    motorState = MotorState.OFF;
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

  constructor();

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
