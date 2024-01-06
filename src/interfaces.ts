export interface Options {
  angleOffset?: number;
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