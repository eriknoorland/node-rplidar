const parseDecToBinary = require('../utils/parseDecToBinary');

/**
 *
 * @param {Array} data
 * @return {Array}
 */
const info = data => {
  const model = parseInt(parseDecToBinary(data[0]), 2);
  const firmware = `${parseInt(parseDecToBinary(data[2]), 2)}.${parseInt(parseDecToBinary(data[1]), 2)}`;
  const hardware = parseInt(parseDecToBinary(data[3]), 2);
  const serialnumber = data.slice(4, 20).reduce((acc, number) => `${acc}${number.toString(16)}`, '');

  return { model, firmware, hardware, serialnumber };
};

module.exports = info;
