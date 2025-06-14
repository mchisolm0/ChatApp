import * as React from 'react'
import { Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { useSignUp, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/models'
import { ThemedStyle } from '@/theme'
import { useAppTheme } from '@/utils/useAppTheme';
import { useEffect } from 'react';
import { Screen } from '@/components';

const SignUpScreen: React.FC = () => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { user } = useUser()
  const router = useRouter()
  const { authStore } = useStores()
  const { themed } = useAppTheme()

  // Update auth store when user data is available
  useEffect(() => {
    if (user) {
      const email = user.primaryEmailAddress?.emailAddress || ''
      const username = user.username || ''
      authStore.setUserData(email, username)
    }
  }, [user])

  // Local state for verification step
  const [verifying, setVerifying] = React.useState(false)
  const [pendingSessionId, setPendingSessionId] = React.useState<string | null>(null)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    try {
      const signUpAttempt = await signUp.create({
        emailAddress: authStore.emailAddress,
        password: authStore.password,
      })
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace("/")
      } else {
        // Prepare email verification
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
        setPendingSessionId(signUpAttempt.createdSessionId || null)
        setVerifying(true)
      }
    } catch (error: any) {
      authStore.setProp('error', error?.errors?.[0]?.message || error?.message || String(error))
    }
  }

  // Handle verification code submission
  const onVerifyCode = async () => {
    authStore.setProp('error', undefined)
    if (!isLoaded || !signUp || !setActive) return
    try {
      const verificationAttempt = await signUp.attemptEmailAddressVerification({ code: authStore.code })
      if (verificationAttempt.status === "complete") {
        await setActive({ session: verificationAttempt.createdSessionId })
        router.replace("/")
      } else {
        authStore.setProp('error', "Verification not complete. Please check the code and try again.")
      }
    } catch (error: any) {
      authStore.setProp('error', error?.errors?.[0]?.message || error?.message || String(error))
    }
  }

  return (
    <Screen safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>
      {verifying ? (
        <>
          <Text>Enter the verification code sent to your email:</Text>
          <TextInput
            value={authStore.code}
            placeholder="Verification code"
            onChangeText={(text) => authStore.setCode(text)}
            autoCapitalize="none"
            keyboardType="number-pad"
            style={{ marginVertical: 12, borderWidth: 1, borderColor: '#ccc', padding: 8 }}
          />
          {authStore.error && <Text style={{ color: 'red' }}>{authStore.error}</Text>}
          <TouchableOpacity style={themed($signUpButton)} onPress={onVerifyCode}>
            <Text style={themed($signUpText)}>Verify</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text>Sign up</Text>
          <TextInput
            autoCapitalize="none"
            value={authStore.emailAddress}
            placeholder="Enter your email"
            onChangeText={(text) => authStore.setEmail(text)}
            style={themed($input)}
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            value={authStore.password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(text) => authStore.setPassword(text)}
            style={themed($input)}
          />
          {authStore.error && <Text style={{ color: 'red' }}>{authStore.error}</Text>}
          <TouchableOpacity style={themed($signUpButton)} onPress={onSignUpPress}>
            <Text style={themed($signUpText)}>Continue</Text>
          </TouchableOpacity>
          <View style={{ display: 'flex', gap: 3 }}>
            <Text>Already have an account?</Text>
            <TouchableOpacity style={themed($signInButton)} onPress={() => router.push('/sign-in')}>
              <Text style={themed($signInText)}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Screen>
  )
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.background,
  alignItems: "center",
  justifyContent: "center",
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

export default observer(SignUpScreen)