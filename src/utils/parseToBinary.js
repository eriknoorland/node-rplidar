/**
 * Converts a hexadecimal number into an 8 bit binary string
 * @param {Number} value
 * @param {Number} radix
 * @return {String}
 */
module.exports = (value, radix = 10) => ('000000000' + parseInt(value, radix).toString(2)).substr(-8);
