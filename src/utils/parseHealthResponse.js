const Response = require('../Response');
const getSingleRequestSingleResponse = require('./getSingleRequestSingleResponse');
const parseDecToBinary = require('./parseDecToBinary');

/**
 * Health response event handler
 * @param {Buffer} buffer
 * @return {Object}
 */
const parseHealthResponse = (buffer) => {
  const responseBuffer = getSingleRequestSingleResponse(Response.HEALTH, buffer);
  const status = parseInt(parseDecToBinary(responseBuffer[0]), 2);
  const error = parseInt(`${parseDecToBinary(responseBuffer[2])}${parseDecToBinary(responseBuffer[1])}`, 2)
  
  return { status, error };
}

module.exports = parseHealthResponse;
