import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Switch, Text, View } from 'react-native'
import EscPosPrinter, { IPrinter } from 'react-native-esc-pos-printer'

type Device = {
  name: string
  ip: string
  mac: string
}

const toDevice = (rawPrinter: IPrinter): Device => ({
  ip: rawPrinter.ip,
  mac: rawPrinter.mac,
  name: rawPrinter.name,
})

export default function App() {
  const [scanning, setScanning] = useState(false)
  const [devices, setDevices] = useState<Device[]>([])

  const hasDevices = devices.length > 0

  const scan = async () => {
    EscPosPrinter.discover()
      .then((printers) => setDevices(printers.map(toDevice)))
      .catch((e) => console.error(e))
      .finally(() => setScanning(false))
  }

  useEffect(() => {
    if (scanning) {
      scan()
    }
  }, [scanning])

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Switch value={scanning} onValueChange={setScanning} />

      {scanning && <ActivityIndicator />}

      {!hasDevices && (
        <FlatList
          data={devices}
          renderItem={({ item }) => (
            <Text>
              {item.mac} - {item.name}
            </Text>
          )}
        />
      )}
    </View>
  )
}
