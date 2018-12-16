const Constant = require('../Constant');

/**
 * Returns whether the buffer contains a response descriptor
 * @param {Response} response
 * @param {Buffer} buffer
 * @return {Boolean}
 */
const bufferHasResponseDescriptor = ({ bytes, dataLength }, buffer) => {
  if (buffer.length < Constant.RESPONSE_DESCRIPTOR_LENGTH + dataLength) {
    return false;
  }

  return buffer.indexOf(Buffer.from(bytes), 0, 'hex') !== -1;
}

module.exports = bufferHasResponseDescriptor;
