export type DeviceBluetooth = {
  name: string | null
  id: string | null
}

export interface IBlueTooth {
  readonly devices: ReadonlyArray<DeviceBluetooth>
  readonly connectedTo: DeviceBluetooth | null
  connect(deviceId: string): Promise<void>
  disconnect(): Promise<void>
  scan(): Promise<void>
  stopScan(): Promise<void>
  getInstance(): Promise<any>
}
