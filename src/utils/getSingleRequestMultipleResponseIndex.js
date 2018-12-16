/**
 * Returns the index of the response of a single request multiple response in a buffer
 * @param {Response} response
 * @param {Buffer} buffer
 * @return {int}
 */
const getSingleRequestMultipleResponseIndex = ({ bytes }, buffer) => 
  buffer.indexOf(Buffer.from(bytes), 0, 'hex');

module.exports = getSingleRequestMultipleResponseIndex;
