import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, ViewStyle, TextStyle } from 'react-native';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { spacing, ThemedStyle } from '@/theme';
import { Drawer } from 'expo-router/drawer';

export default function ChatScreen() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme()

  return (
    <Screen safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>
      <Drawer>
        <Drawer.Screen
          name="chat" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'New Chat',
            title: 'New Chat',
          }}
        />
        <Drawer.Screen
          name="chats/[id]" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'User',
            title: 'overview',
          }}
        />
      </Drawer>
    </Screen>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 9,
  display: 'flex',
  flexDirection: 'column',
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: 'absolute',
  bottom: '100%',
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.error,
  padding: spacing.xs,
  borderRadius: spacing.xs,
  marginBottom: spacing.xs
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  textAlign: 'center'
})

const $input: ThemedStyle<TextStyle> = ({ spacing }) => ({
  backgroundColor: 'white',
  margin: spacing.md,
  padding: spacing.md
})