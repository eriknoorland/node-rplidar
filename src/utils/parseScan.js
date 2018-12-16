const parseDecToBinary = require('./parseDecToBinary');

/**
 * Parse scan
 * @param {Buffer} buffer
 * @return {Object}
 */
const parseScan = (buffer) => {
  const byte0 = parseDecToBinary(buffer[0]);
  const byte1 = parseDecToBinary(buffer[1]);
  const byte2 = parseDecToBinary(buffer[2]);
  const byte3 = parseDecToBinary(buffer[3]);
  const byte4 = parseDecToBinary(buffer[4]);

  const startFlagBit = byte0.substring(7, 8);
  const inverseStartFlagBit = byte0.substring(6, 7);
  const quality = parseInt(byte0.substring(0, 6), 2);
  const checkBit = byte1.substring(7, 8);
  const angle = parseInt(byte2 + byte1.substring(0, 7), 2) / 64;
  const distance = parseInt(byte4 + byte3, 2) / 4;

  if (startFlagBit === inverseStartFlagBit) {
    throw new Error('ParseError: !S === S');
  }

  if (checkBit !== '1') {
    throw new Error('ParseError: checkBit not 1');
  }

  return { quality, angle, distance };
}

module.exports = parseScan;
