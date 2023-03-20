import Manager, { BleScanMode } from 'react-native-ble-manager'
import { DeviceBluetooth, IBlueTooth } from './../contracts/bluetooth'
import base64 from 'react-native-base64'


function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  { 
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
  }
  }

  return out;
}
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

    this._devices = devices.filter(device => !!device.advertising.localName).map((device) => ({
      id: device.id,
      name: device.name,
    }))

    console.log(JSON.stringify(devices.filter(device => !!device.advertising.localName), null, 2))

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
