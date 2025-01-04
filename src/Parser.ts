import { Transform } from 'stream';
import Constant from './Constant';
import Response from './Response';
import bufferHasResponseDescriptor from './utils/bufferHasResponseDescriptor';
import healthParser from './parsers/health';
import infoParser from './parsers/info';
import dataParser from './parsers/data';
import { HealthPacket, InfoPacket, ScanPacket } from './interfaces';

class Parser extends Transform {
  private angleOffset: number;
  private startFlags: Buffer;
  private buffer: Buffer;
  private isScanning: boolean;

  constructor(angleOffset: number) {
    super();

    this.angleOffset = angleOffset;
    this.startFlags = Buffer.from([Constant.START_FLAG_1, Constant.START_FLAG_2]);
    this.buffer = Buffer.alloc(0);
    this.isScanning = false;
  }

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    if (this.isScanning) {
      const numScanDataPackets = Math.floor(this.buffer.length / Constant.SCAN_DATA_PACKET_SIZE);

      for (let i = 0; i < numScanDataPackets; i++) {
        const scanPacketData = [...this.buffer.slice(0, Constant.SCAN_DATA_PACKET_SIZE)] as ScanPacket;

        try {
          this.emit('scan_data', dataParser(this.angleOffset, scanPacketData));
          this.buffer = this.buffer.slice(Constant.SCAN_DATA_PACKET_SIZE);
        } catch (error) {
          console.log('Parse scan error', error);
          this.buffer = this.buffer.slice(1);
        }
      }
    } else {
      for (let j = 0; j < this.buffer.length; j++) {
        const packetStart = this.buffer.indexOf(this.startFlags, 0, 'hex');

        if (packetStart !== -1 && this.buffer.length > packetStart + Constant.RESPONSE_DESCRIPTOR_LENGTH) {
          const dataLength = this.buffer[packetStart + 2];
          // const sendMode = 0;
          // const dataType = this.buffer[packetStart + 6];
          // const isMultipleResponse = dataType === 1;

          if (this.buffer.length >= packetStart + Constant.RESPONSE_DESCRIPTOR_LENGTH + dataLength) {
            const packetEnd = packetStart + Constant.RESPONSE_DESCRIPTOR_LENGTH + dataLength;
            const packet = this.buffer.slice(packetStart, packetEnd);
            const packetData = [];

            this.buffer = this.buffer.slice(packetEnd);
            j = 0;

            for (let i = 0; i < dataLength; i++) {
              packetData.push(packet[Constant.RESPONSE_DESCRIPTOR_LENGTH + i]);
            }

            switch (true) {
              case bufferHasResponseDescriptor(Response.HEALTH, packet):
                this.emit('health', healthParser(packetData as HealthPacket));
                break;

              case bufferHasResponseDescriptor(Response.INFO, packet):
                this.emit('info', infoParser(packetData as InfoPacket));
                break;

              case bufferHasResponseDescriptor(Response.SCAN_START, packet):
                this.emit('scan_start');
                this.isScanning = true;
                break;
            }
          }
        }
      }
    }

    callback();
  }
}

export default Parser;
