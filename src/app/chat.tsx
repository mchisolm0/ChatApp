import { ChatInterface } from '@/components/ChatInterface';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { ThemedStyle } from '@/theme';
import { TextStyle, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as styles from '@/styles/auth'

export default function ChatScreen() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed($container)} >
      <TouchableOpacity
        style={themed($authSelector)}
        onPress={() => {
          try {
            router.push('/sign-in')
          } catch (error) {
            console.error("Navigate error" + error)
          }
        }}
      >
        <Text style={themed($authText)}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={themed($authSelector)}
        onPress={() => {
          router.push('/sign-up')
        }}
      >
        <Text style={themed($authText)}>Sign Up</Text>
      </TouchableOpacity>
      <ChatInterface />
    </Screen>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

const $authSelector: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: spacing.xs,
  padding: spacing.sm,
  marginVertical: spacing.xs,
  alignItems: 'center',
});

const $authText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
  fontWeight: '600',
});
