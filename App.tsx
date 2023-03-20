import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, PermissionsAndroid, Switch, Text, View } from 'react-native'
import { bleManager } from './src/adapters/blue-manager'

export default function App() {
  const [scanning, setScanning] = useState(false)

  const hasDevices = bleManager.devices.length > 0

  useEffect(() => {
    if (scanning) {
      bleManager.scan()
      return
    }

    bleManager.stopScan()
  }, [scanning])

  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    ])
  }, [])

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
          data={bleManager.devices}
          renderItem={({ item }) => (
            <Text>
              {item.id} - {item.name}
            </Text>
          )}
        />
      )}
    </View>
  )
}
