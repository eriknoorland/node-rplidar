const Transform = require('stream').Transform;
const Constant = require('./Constant');
const Response = require('./Response');
const bufferHasResponseDescriptor = require('./utils/bufferHasResponseDescriptor');
const healthParser = require('./parsers/health');
const infoParser = require('./parsers/info');
const dataParser = require('./parsers/data');
const numDescriptorBytes = 7;

/**
 * Parser
 */
class Parser extends Transform {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.startFlags = Buffer.from([0xA5, 0x5A]);
    this.buffer = Buffer.alloc(0);
    this.isScanning = false;
  }

  /**
   * Transform
   * @param {Buffer} chunk
   * @param {String} encoding
   * @param {Function} callback
   */
  _transform(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    if (this.isScanning) {
      const numScanDataPackets = Math.floor(this.buffer.length / 5);

      for (let i = 0; i < numScanDataPackets; i++) {
        const scanPacketData = this.buffer.slice(0, 5);
        try {
          const parsedScanData = dataParser(scanPacketData);

          this.emit('scan_data', parsedScanData);
          this.buffer = this.buffer.slice(5);
        } catch (error) {
          console.log('Parse scan error', error);
          this.buffer = this.buffer.slice(1);
        }
      }
    } else {
      for (let j = 0; j < this.buffer.length; j++) {
        if (this.buffer.indexOf(this.startFlags, 0, 'hex') !== -1) {
          const packetStart = this.buffer.indexOf(this.startFlags, 0, 'hex');

          if (this.buffer.length > packetStart + numDescriptorBytes) {
            const dataLength = this.buffer[packetStart + 2]; // 30 bits
            const sendMode = 0; // 2 bits
            const dataType = this.buffer[packetStart + 6];
            const isMultipleResponse = dataType === 1;

            // FIXME differ between single response and multiple response handling

            if (this.buffer.length >= packetStart + numDescriptorBytes + dataLength) {
              const packetEnd = packetStart + numDescriptorBytes + dataLength;
              const packet = this.buffer.slice(packetStart, packetEnd);
              const packetData = [];

              this.buffer = this.buffer.slice(packetEnd);
              j = 0;

              for (let i = 0; i < dataLength; i++) {
                const index = numDescriptorBytes + i;
                packetData.push(packet[index]);
              }

              switch(true) {
                case bufferHasResponseDescriptor(Response.HEALTH, packet):
                  this.emit('health', healthParser(packetData));
                  break;

                case bufferHasResponseDescriptor(Response.INFO, packet):
                  this.emit('info', infoParser(packetData));
                  break;

                case bufferHasResponseDescriptor(Response.SCAN_START, packet):
                  this.emit('scan_start');
                  this.isScanning = true;
                  break;
              }
            }
          }
        }
      }
    }

    callback();
  }
}

module.exports = Parser;
