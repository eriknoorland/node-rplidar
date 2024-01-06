import parseToBinary from '../utils/parseToBinary';
import { HealthResponse } from '../interfaces';
import { HealthPacket } from '../types';

 export default (data: HealthPacket): HealthResponse => {
  const status = parseInt(parseToBinary(data[0]), 2);
  const error = parseInt(`${parseToBinary(data[2])}${parseToBinary(data[1])}`, 2)

  return {
    status,
    error,
  };
};
