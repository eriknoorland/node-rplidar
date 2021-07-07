const parseToBinary = require('../utils/parseToBinary');

/**
 *
 * @param {Array} data
 * @return {Array}
 */
 module.exports = data => {
  const byte0 = parseToBinary(data[0]);
  const byte1 = parseToBinary(data[1]);
  const byte2 = parseToBinary(data[2]);
  const byte3 = parseToBinary(data[3]);
  const byte4 = parseToBinary(data[4]);

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
};
