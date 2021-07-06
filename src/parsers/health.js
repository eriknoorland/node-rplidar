const parseDecToBinary = require('../utils/parseDecToBinary');

/**
 *
 * @param {Array} data
 * @return {Array}
 */
const health = data => {
  const status = parseInt(parseDecToBinary(data[0]), 2);
  const error = parseInt(`${parseDecToBinary(data[2])}${parseDecToBinary(data[1])}`, 2)

  return {
    status,
    error,
  };
};

module.exports = health;
