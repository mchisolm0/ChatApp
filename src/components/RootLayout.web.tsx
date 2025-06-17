import { View } from "react-native"
import { Stack } from "expo-router"

export default function RootLayout() {

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </View>
  )
}