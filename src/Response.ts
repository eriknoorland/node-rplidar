import Constant from './Constant';
import ResponseMode from './ResponseMode';

export default {
  HEALTH: {
    mode: ResponseMode.SINGLE,
    bytes: [Constant.START_FLAG_1, Constant.START_FLAG_2, 0x03, 0x00, 0x00, 0x00, 0x06],
    dataLength: 3,
  },

  INFO: {
    mode: ResponseMode.SINGLE,
    bytes: [Constant.START_FLAG_1, Constant.START_FLAG_2, 0x14, 0x00, 0x00, 0x00, 0x04],
    dataLength: 20,
  },

  SCAN_START: {
    mode: ResponseMode.MULTIPLE,
    bytes: [Constant.START_FLAG_1, Constant.START_FLAG_2, 0x05, 0x00, 0x00, 0x40, 0x81],
    dataLength: 5,
  },
};
