const Constant = require('./Constant');
const requests = {
  STOP: 0x25,
  RESET: 0x40,
  SCAN: 0x20,
  EXPRESS_SCAN: 0x82,
  FORCE_SCAN: 0x21,
  GET_INFO: 0x50,
  GET_HEALTH: 0x52,
  GET_SAMPLERATE: 0x59,
};

module.exports = Object
  .entries(requests)
  .reduce((acc, [key, value]) => ({
    ...acc,
    [key]: Buffer.from([Constant.START_FLAG_1, value]),
  }), {});
