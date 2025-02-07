import { SerialPort } from 'serialport';
import Parser from './Parser';
import Request from './Request';
import TypedEventEmitter from './TypedEventEmitter';
import { RPLidar, HealthResponse, HealthStatus, InfoResponse, LidarEventTypes, Options, ScanResponse } from './interfaces';

export default (path: string, options: Options = {}): RPLidar => {
  const eventEmitter = new TypedEventEmitter<LidarEventTypes>();

  let port: SerialPort;
  let parser: Parser;

  function init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (port) {
        setTimeout(reject, 0);
      }

      port = new SerialPort({ path, baudRate: 115200 }, error => {
        if (error) {
          reject(error);
        }
      });

      parser = port.pipe(new Parser(options.angleOffset || 0));

      parser.on('scan_data', (data: ScanResponse) => {
        eventEmitter.emit('data', data);
      });

      port.on('error', error => eventEmitter.emit('error', error));
      port.on('disconnect', () => eventEmitter.emit('disconnect'));
      port.on('close', () => eventEmitter.emit('close'));
      port.on('open', onPortOpen.bind(null, resolve, reject));
    });
  }

  function health(): Promise<HealthResponse> {
    port.write(Request.GET_HEALTH);

    return new Promise((resolve, reject) => {
      parser.once('health', (healthStatus: HealthResponse) => {
        const { status, error } = healthStatus;

        if (status !== HealthStatus.GOOD) {
          const type = status === HealthStatus.WARNING ? 'warning' : 'error';

          reject(`Health check failed with ${type} code ${error}`);
        }

        resolve(healthStatus);
      });
    });
  }

  function info(): Promise<InfoResponse> {
    port.write(Request.GET_INFO);

    return new Promise(resolve => {
      parser.once('info', resolve);
    });
  }

  async function scan(): Promise<void> {
    try {
      await health();
    } catch(error) {
      return Promise.reject(error);
    }

    port.set({ dtr: false }, error => {});

    const promise: Promise<void> = new Promise(resolve => setTimeout(resolve, 0));

    promise.then((): Promise<void> => {
      port.write(Request.SCAN);

      return new Promise(resolve => {
        parser.once('scan_start', resolve);
      });
    });

    return promise;
  }

  function stop(): Promise<void> {
    port.write(Request.STOP);

    return new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  function reset(): Promise<void> {
    port.write(Request.RESET);

    return new Promise(resolve => {
      setTimeout(resolve, 10);
    });
  }

  function close(): Promise<void> {
    return new Promise(resolve => {
      port.close(() => {
        resolve();
      });
    });
  }

  function onPortOpen(resolve: Function, reject: Function) {
    port.flush(error => {
      if (error) {
        eventEmitter.emit('error', error);
        reject();
      }

      resolve();
    });
  }

  return Object.freeze({
    close,
    init,
    health,
    info,
    scan,
    stop,
    reset,
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter),
  });
};
