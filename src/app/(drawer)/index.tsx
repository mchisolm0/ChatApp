import { ChatInterface } from '@/components/ChatInterface';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme'
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router'
import { useClerk } from '@clerk/clerk-expo'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { $indexContainer, $authButtonsContainer, $authButton, $authButtonText } from '@/styles/chat';

function SignInButtons() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <View style={themed($authButtonsContainer)}>
      <TouchableOpacity
        style={themed($authButton)}
        onPress={() => router.navigate('/sign-in')}
      >
        <Text style={themed($authButtonText)}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={themed($authButton)}
        onPress={() => router.navigate('/sign-up')}
      >
        <Text style={themed($authButtonText)}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

function SignOutButton() {
  const { themed } = useAppTheme()
  const { signOut } = useClerk()

  return (
    <TouchableOpacity
      style={themed($authButton)}
      onPress={() => signOut()}
    >
      <Text style={themed($authButtonText)}>Sign Out</Text>
    </TouchableOpacity>
  )
}

export default function ChatScreen() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed($indexContainer)}>
      <ChatInterface />
    </Screen>
  );
}


