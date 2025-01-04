import parseToBinary from '../utils/parseToBinary';
import { InfoResponse, InfoPacket } from '../interfaces';

export default (data: InfoPacket): InfoResponse => {
  const model = parseInt(parseToBinary(data[0]), 2);
  const firmware = `${parseInt(parseToBinary(data[2]), 2)}.${parseInt(parseToBinary(data[1]), 2)}`;
  const hardware = parseInt(parseToBinary(data[3]), 2);
  const serialnumber = data.slice(4, 20).reduce((acc, number) => `${acc}${number.toString(16)}`, '');

  return { model, firmware, hardware, serialnumber };
};
