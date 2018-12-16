const Transform = require('stream').Transform;
const Constant = require('./Constant');
const Response = require('./Response');
const bufferHasResponseDescriptor = require('./utils/bufferHasResponseDescriptor');
const parseHealthResponse = require('./utils/parseHealthResponse');
const parseInfoResponse = require('./utils/parseInfoResponse');
const parseScan = require('./utils/parseScan');

/**
 * Parser
 */
class Parser extends Transform {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.scanByteLength = Response.SCAN_START.dataLength;
    this.buffer = Buffer.alloc(this.scanByteLength);
    this.isScanning = false;
    this.position = 0;
  }

  /**
   * Transform
   * @param {Buffer} chunk
   * @param {String} encoding
   * @param {Function} callback
   */
  _transform(chunk, encoding, callback) {
    if (this.isScanning) {
      let cursor = 0;

      while (cursor < chunk.length) {
        this.buffer[this.position] = chunk[cursor];

        cursor++;
        this.position++;
        
        if (this.position === this.scanByteLength) {
          try {
            this.emit('scan_data', parseScan(this.buffer));
          } catch(error) {
            console.log('Parse scan error', error);
          }

          this.buffer = Buffer.alloc(this.scanByteLength);
          this.position = 0;
        }
      }
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk]);

      if (bufferHasResponseDescriptor(Response.HEALTH, this.buffer)) {
        this.emit('health', parseHealthResponse(this.buffer));
        this.buffer = this.buffer.slice(Constant.RESPONSE_DESCRIPTOR_LENGTH + Response.HEALTH.dataLength);
      }

      if (bufferHasResponseDescriptor(Response.INFO, this.buffer)) {
        this.emit('info', parseInfoResponse(this.buffer));
        this.buffer = this.buffer.slice(Constant.RESPONSE_DESCRIPTOR_LENGTH + Response.INFO.dataLength);
      }

      if (bufferHasResponseDescriptor(Response.SCAN_START, this.buffer)) {
        this.emit('scan_start');
        this.buffer = this.buffer.slice(Constant.RESPONSE_DESCRIPTOR_LENGTH);
        this.isScanning = true;
      }
    }

    callback();
  }
}

module.exports = Parser;
