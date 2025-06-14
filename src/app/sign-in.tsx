import { useSignIn, useUser } from '@clerk/clerk-expo'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/models'
import { useAppTheme } from '@/utils/useAppTheme';
import { ThemedStyle } from '@/theme';
import { Link, useRouter } from 'expo-router'
import { Button, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import React, { useEffect } from 'react'
import * as Sentry from "@sentry/react-native";
import { Screen } from '@/components';

const PageComponent: React.FC = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const { authStore } = useStores()
  const router = useRouter()
  const { themed } = useAppTheme()

  // Handle the submission of the sign-in form
  const { user } = useUser()

  // Update auth store when user data is available
  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress || ''
      const username = user.username || ''
      authStore.setUserData(email, username)
    }
  }, [user])

  const onSignInPress = async () => {
    if (!isLoaded) return
    try {
      const signInAttempt = await signIn.create({
        identifier: authStore.emailAddress,
        password: authStore.password,
      })
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace("/")
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      authStore.setProp('error', error?.errors?.[0]?.message || error?.message || 'Unknown error')
      // Handle error (you might want to show this to the user)
    }
  }

  return (
    <Screen safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>
      <Text>Sign in</Text>
      <TextInput
        autoCapitalize="none"
        value={authStore.emailAddress}
        placeholder="Email or username"
        onChangeText={(text) => authStore.setEmail(text)}
        style={themed($input)}
        keyboardType="email-address"
        autoComplete="username"
      />
      <TextInput
        value={authStore.password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(text) => authStore.setPassword(text)}
        style={themed($input)}
      />
      <TouchableOpacity style={themed($signInButton)} onPress={onSignInPress}>
        <Text style={themed($signInText)}>Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', gap: 3 }}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity style={themed($signUpButton)} onPress={() => router.push('/sign-up')}>
          <Text style={themed($signUpText)}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Button title='Try!' onPress={() => { Sentry.captureException(new Error('First error')) }} />
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  alignItems: 'center',
  justifyContent: 'center',
})

const $signInButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.spacing.sm,
  alignItems: 'center',
})

const $signInText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontWeight: '600',
})

const $signUpButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.spacing.sm,
  alignItems: 'center',
})

const $signUpText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontWeight: '600',
})

const $input: ThemedStyle<TextStyle> = (theme) => ({
  width: '80%',
  height: 50,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral400,
  borderRadius: 8,
  paddingHorizontal: 12,
  marginBottom: 16,
  color: theme.colors.text,
  backgroundColor: theme.colors.background,
})

const $orText: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 12,
  color: theme.isDark ? theme.colors.palette.neutral400 : theme.colors.palette.neutral600,
})

export default observer(PageComponent)