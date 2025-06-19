import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen } from "@/components"
import { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { ChatInterface } from "@/components/ChatInterface"

export default observer(function ChatScreen() {
  const { themed } = useAppTheme()

  return (
    <Screen safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>
      <ChatInterface />
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})
