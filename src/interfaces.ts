export type HealthPacket = [number, number, number];

export type InfoPacket = [number, number, number, number, number];

export type ScanPacket = [number, number, number, number, number];

export interface Options {
  angleOffset?: number;
};

export enum HealthStatus {
  GOOD = 0,
  WARNING = 1,
  ERROR = 2,
};

export interface HealthResponse {
  status: number;
  error: number;
};

export interface InfoResponse {
  model: number;
  firmware: string;
  hardware: number;
  serialnumber: string;
};

export interface ScanResponse {
  quality: number;
  angle: number;
  distance: number;
};

export interface Response {
  mode: number;
  bytes: number[];
  dataLength: number;
};

export type LidarEventTypes = {
  'data': ScanResponse[]
  'error': Error[]
  'disconnect': []
  'close': []
}

type EventName = keyof LidarEventTypes
type EventHandler = (...eventArg: LidarEventTypes[EventName]) => void

export interface RPLidar {
  close: () => Promise<void>
  init: () => Promise<void>
  health: () => Promise<HealthResponse>
  info: () => Promise<InfoResponse>
  scan: () => Promise<void>
  stop: () => Promise<void>
  reset: () => Promise<void>
  on: (eventName: EventName, handler: EventHandler) => void
  off: (eventName: EventName, handler: EventHandler) => void
}