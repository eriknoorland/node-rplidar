/**
 * Converts a decimal integer into an 8 bit binary string
 * @param {int} dec
 * @return {String}
 */
const parseDecToBinary = (dec) => ('000000000' + parseInt(dec, 10).toString(2)).substr(-8);

module.exports = parseDecToBinary;
