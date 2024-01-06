import Constant from './Constant';

export default {
  STOP: [Constant.START_FLAG_1, 0x25],
  RESET: [Constant.START_FLAG_1, 0x40],
  SCAN: [Constant.START_FLAG_1, 0x20],
  EXPRESS_SCAN: [Constant.START_FLAG_1, 0x82],
  FORCE_SCAN: [Constant.START_FLAG_1, 0x21],
  GET_INFO: [Constant.START_FLAG_1, 0x50],
  GET_HEALTH: [Constant.START_FLAG_1, 0x52],
  GET_SAMPLERATE: [Constant.START_FLAG_1, 0x59],
};
