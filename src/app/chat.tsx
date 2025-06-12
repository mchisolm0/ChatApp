import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, ViewStyle } from 'react-native';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { spacing, ThemedStyle } from '@/theme';

export default function ChatScreen() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme()

  if (error) return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
      <View
        style={themed($topContainer)}
      >
        <Text>{error.message}</Text>
      </View>
      <View
        style={themed($bottomContainer)}
      >
        <TextInput
          style={{ backgroundColor: 'white', padding: spacing.sm}}
          placeholder="Say something..."
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
          onSubmitEditing={e => {
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
        />
      </View>
    </Screen>
  )


  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={themed($container)}>
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

        <View style={themed($bottomContainer)}>
          <TextInput
            style={{ backgroundColor: 'white', margin: spacing.md, padding: spacing.md }}
            placeholder="Say something..."
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
            onSubmitEditing={e => {
              handleSubmit(e);
              e.preventDefault();
            }}
            autoFocus={true}
          />
        </View>
      </View>
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
  alignItems: 'center',
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})