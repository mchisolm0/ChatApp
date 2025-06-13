import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "@/components"
import { isRTL } from "@/i18n"
import { ThemedStyle } from "@/theme"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { useAppTheme } from "@/utils/useAppTheme"
import { Link } from "expo-router"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { TextInput, ScrollView } from 'react-native';
import { useAppTheme } from '@/utils/useAppTheme';
import { ThemedStyle } from '@/theme';

// TODO Refactor into component to reuse between chat and chat/[id]
export default function ChatScreen() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <View
        style={themed($topContainer)}
      >
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                <Text>{m.content}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
      <View style={themed($bottomContainer)}>
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)}>{error.message}</Text>
          </View>
        )}
        <TextInput
          style={themed($input)}
          placeholder="chatScreen:placeholderText"
          value={input}
          onChange={e =>
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: e.nativeEvent.text,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          // TODO Verify e.preventDefault() is needed. It is in the docs but
          // CodeRabbit claims it will throw at runtime (even though it works)
          onSubmitEditing={e => {
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
        />
      </View>
    </View>
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

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})
