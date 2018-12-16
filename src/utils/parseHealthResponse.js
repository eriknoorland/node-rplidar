const hexToBinary = require('hex-to-binary');
const Response = require('../Response');
const getSingleRequestSingleResponse = require('./getSingleRequestSingleResponse');

/**
 * Health response event handler
 * @param {Buffer} buffer
 * @return {Object}
 */
const parseHealthResponse = (buffer) => {
  const responseBuffer = getSingleRequestSingleResponse(Response.HEALTH, buffer);
  const status = parseInt(hexToBinary(`${responseBuffer[0]}`), 2);
  const error = parseInt(`${hexToBinary(`${responseBuffer[2]}`)}${hexToBinary(`${responseBuffer[1]}`)}`, 2)
  
  return { status, error };
}

module.exports = parseHealthResponse;
