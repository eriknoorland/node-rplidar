/**
 * Converts a hexadecimal number into an 8 bit binary string
 * @param {int} hex
 * @return {String}
 */
const parseHexToBinary = (hex) => ('000000000' + parseInt(hex, 16).toString(2)).substr(-8);

module.exports = parseHexToBinary;
