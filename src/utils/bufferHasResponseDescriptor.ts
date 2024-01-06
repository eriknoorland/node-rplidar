import Constant from '../Constant';
import { Response } from '../interfaces';

export default ({ bytes, dataLength }: Response, buffer: Buffer) => {
  if (buffer.length < Constant.RESPONSE_DESCRIPTOR_LENGTH + dataLength) {
    return false;
  }

  return buffer.indexOf(Buffer.from(bytes), 0, 'hex') !== -1;
}
