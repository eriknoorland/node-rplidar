const Response = require('../Response');
const getSingleRequestSingleResponse = require('./getSingleRequestSingleResponse');
const parseDecToBinary = require('./parseDecToBinary');

/**
 * Info response event handler
 * @param {Buffer} buffer
 * @return {Object}
 */
const parseInfoResponse = (buffer) => {
  const responseBuffer = getSingleRequestSingleResponse(Response.INFO, buffer);
  const model = parseInt(parseDecToBinary(responseBuffer[0]), 2);
  const firmware = `${parseInt(parseDecToBinary(responseBuffer[2]), 2)}.${parseInt(parseDecToBinary(responseBuffer[1]), 2)}`;
  const hardware = parseInt(parseDecToBinary(responseBuffer[3]), 2);
  const serialnumber = responseBuffer.slice(4, 20).reduce((acc, number) => `${acc}${number.toString(16)}`, '');

  return { model, firmware, hardware, serialnumber };
}

module.exports = parseInfoResponse;
