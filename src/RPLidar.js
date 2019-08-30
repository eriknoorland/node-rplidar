const EventEmitter = require('events');
const SerialPort = require('serialport');
const Parser = require('./Parser');
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

      port = new SerialPort(path, { baudRate: 115200 });
      parser = port.pipe(new Parser());

      parser.on('scan_data', (data) => {
        eventEmitter.emit('data', data);
      });

      port.on('error', error => eventEmitter.emit('error', error));
      port.on('disconnect', () => eventEmitter.emit('disconnect'));
      port.on('close', () => eventEmitter.emit('close'));
      port.on('open', onPortOpen.bind(null, resolve));
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
      parser.once('health', (health) => {
        resolve(health);
        state = State.IDLE;
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

    return new Promise((resolve, reject) => {
      parser.once('info', (info) => {
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

    return new Promise((resolve) => {
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

    return new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }
  
  /**
   * Start motor
   * @return {Promise}
   */
  function startMotor() {
    port.set({ dtr: false });
    motorState = MotorState.ON;

    return new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
  }

  /**
   * Stop motor
   */
  function stopMotor() {
    port.set({ dtr: true });
    motorState = MotorState.OFF;
  }

  /**
   * Port open event handler
   * @param {Function} resolve
   */
  function onPortOpen(resolve) {
    port.flush(error => {
      if (error) {
        eventEmitter.emit('error', error);
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
