import Manager, { BleScanMode } from 'react-native-ble-manager'
import { DeviceBluetooth, IBlueTooth } from './../contracts/bluetooth'

export class BleManager implements IBlueTooth {
  private initialized: boolean = false
  private _devices: ReadonlyArray<DeviceBluetooth>
  private _connectedTo: DeviceBluetooth | null

  constructor() {
    this._devices = []
    this.getInstance()
  }

  get devices(): ReadonlyArray<DeviceBluetooth> {
    return [...this._devices]
  }

  get connectedTo(): DeviceBluetooth | null {
    return JSON.parse(JSON.stringify(this._connectedTo))
  }

  async connect(deviceId: string): Promise<void> {
    const device = this._devices.find((d) => d.id === deviceId)

    if (device) {
      try {
        await Manager.connect(device.id)
        this._connectedTo = device

        console.log(`Connected to device: ${device.id} - ${device.name}`)
      } catch (e) {
        console.log(e)
      }
    }
  }

  async disconnect(): Promise<void> {
    await Manager.disconnect(this.connectedTo.id)
    this._connectedTo = null

    console.log(
      `Disconnected from device: ${this.connectedTo.id} - ${this.connectedTo.name}`,
    )
  }

  async scan(): Promise<void> {
    Manager.scan([], 5, true, {
      scanMode: BleScanMode.Balanced,
    })
  }

  async stopScan(): Promise<void> {
    const devices = await Manager.getDiscoveredPeripherals()

    this._devices = devices.map((device) => ({
      id: device.id,
      name: device.name,
    }))

    console.log(this.devices)

    await Manager.stopScan()
    console.log('Scan stopped')
  }

  async getInstance(): Promise<void> {
    if (!this.initialized) {
      await Manager.start({ showAlert: false })
      this.initialized = true

      console.log('Bluetooth initialized')
    }

    return Promise.resolve()
  }
}

export const bleManager = new BleManager()
