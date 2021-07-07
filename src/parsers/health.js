const parseToBinary = require('../utils/parseToBinary');

/**
 *
 * @param {Array} data
 * @return {Array}
 */
 module.exports = data => {
  const status = parseInt(parseToBinary(data[0]), 2);
  const error = parseInt(`${parseToBinary(data[2])}${parseToBinary(data[1])}`, 2)

  return {
    status,
    error,
  };
};
