import { ChatInterface } from '@/components/ChatInterface';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme'
import { ThemedStyle } from '@/theme'
import { View, ViewStyle, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router'
import * as styles from '@/styles/auth'
import { useClerk } from '@clerk/clerk-expo'
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

function SignInButtons() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <View style={themed($authContainer)}>
      <TouchableOpacity
        style={themed(styles.$authSelector)}
        onPress={() => router.push('/sign-in')}
      >
        <Text style={themed(styles.$authText)}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={themed(styles.$authSelector)}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={themed(styles.$authText)}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  )
}

function SignOutButton() {
  const { themed } = useAppTheme()
  const { signOut } = useClerk()

  return (
    <TouchableOpacity
      style={themed(styles.$authSelector)}
      onPress={() => signOut()}
    >
      <Text style={themed(styles.$authText)}>Sign Out</Text>
    </TouchableOpacity>
  )
}

export default function ChatScreen() {
  const { themed } = useAppTheme()
  const router = useRouter()

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed($container)}>
      <View style={themed($authContainer)}>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
        <Unauthenticated>
          <SignInButtons />
        </Unauthenticated>
        <AuthLoading>
          <Text>Loading...</Text>
        </AuthLoading>
      </View>
      <ChatInterface />
    </Screen>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

const $authContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  gap: spacing.md,
  padding: spacing.md,
});
