import { TextInput, ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "@/components";
import { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';

interface ChatInterfaceProps {
  threadId?: string;
  apiEndpoint?: string;
}

export function ChatInterface({ threadId, apiEndpoint = '/api/chat' }: ChatInterfaceProps) {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl(apiEndpoint),
    id: threadId,
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme();

  return (
    <View style={themed($container)}>
      <View style={themed($topContainer)}>
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
});

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 9,
  display: 'flex',
  flexDirection: 'column',
  paddingHorizontal: spacing.lg,
});

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
});

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: 'absolute',
  bottom: '100%',
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.error,
  padding: spacing.xs,
  borderRadius: spacing.xs,
  marginBottom: spacing.xs
});

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  textAlign: 'center'
});

const $input: ThemedStyle<TextStyle> = ({ spacing }) => ({
  backgroundColor: 'white',
  margin: spacing.md,
  padding: spacing.md
});
