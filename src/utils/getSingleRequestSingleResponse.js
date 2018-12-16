const Constant = require('../Constant');

/**
 * Returns the response of a single request single response
 * @param {Response} response
 * @param {Buffer} buffer
 * @return {Boolean}
 */
const getSingleRequestSingleResponse = ({ bytes, dataLength }, buffer) => {
  const index = buffer.indexOf(Buffer.from(bytes), 0, 'hex');
  const begin = index + Constant.RESPONSE_DESCRIPTOR_LENGTH;
  const end = index + Constant.RESPONSE_DESCRIPTOR_LENGTH + dataLength;

  return buffer.slice(begin, end);
}

module.exports = getSingleRequestSingleResponse;
