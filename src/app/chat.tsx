import { ChatInterface } from '@/components/ChatInterface';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { $chatScreenContainer, $chatAuthButton, $chatAuthButtonText } from '@/styles/chat';

export default function ChatScreen() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed($chatScreenContainer)} >
      <TouchableOpacity
        style={themed($chatAuthButton)}
        onPress={() => {
          try {
            router.push('/sign-in')
          } catch (error) {
            console.error("Navigate error" + error)
          }
        }}
      >
        <Text style={themed($chatAuthButtonText)}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={themed($chatAuthButton)}
        onPress={() => {
          router.push('/sign-up')
        }}
      >
        <Text style={themed($chatAuthButtonText)}>Sign Up</Text>
      </TouchableOpacity>
      <ChatInterface />
    </Screen>
  );
}


