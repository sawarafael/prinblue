import { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Switch, Text, View } from 'react-native'
import { bleManager } from './src/adapters/blue-manager'

export default function App() {
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (scanning) {
      bleManager.scan()
    }

    if (!scanning) {
      bleManager.stopScan()
    }
  }, [scanning])

  return (
    <View>
      <Switch value={scanning} onValueChange={setScanning} />

      {scanning && <ActivityIndicator />}

      {!scanning && (
        <FlatList
          data={bleManager.devices}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      )}
    </View>
  )
}
