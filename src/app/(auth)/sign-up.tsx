import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { Screen } from '@/components'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useAppTheme } from '../../utils/useAppTheme'
import * as styles from '../../styles/auth'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Validate inputs
    if (!emailAddress.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Failed to create account. Please try again.'
      setError(errorMessage)
      if (__DEV__) {
        console.error('Sign-up error:', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    if (!code.trim()) {
      setError('Please enter the verification code')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        setError('Verification incomplete. Please try again.')
        if (__DEV__) {
          console.error('Verification incomplete:', signUpAttempt)
        }
      }
    } catch (err: any) {
      const errorMessage = err?.errors?.[0]?.message || 'Invalid verification code. Please try again.'
      setError(errorMessage)
      if (__DEV__) {
        console.error('Verification error:', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const { themed } = useAppTheme()

  if (pendingVerification) {
    return (
      <View style={themed(styles.$container)}>
        <Text style={themed(styles.$title)}>Verify your email</Text>
        <TextInput
          value={code}
          placeholder="Enter your verification code"
          style={themed(styles.$input)}
          onChangeText={(code) => setCode(code)}
        />
        {error ? (
          <Text style={themed(styles.$errorText)}>{error}</Text>
        ) : null}
        <TouchableOpacity
          style={[themed(styles.$button), isSubmitting && themed(styles.$buttonDisabled)]}
          onPress={onVerifyPress}
          disabled={isSubmitting}
        >
          <Text style={themed(styles.$buttonText)}>{isSubmitting ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed(styles.$container)}>
      <Text style={themed(styles.$title)}>Sign up</Text>
      <KeyboardAvoidingView>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        style={themed(styles.$input)}
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        style={themed(styles.$input)}
        onChangeText={(password) => setPassword(password)}
      />
      {error ? (
        <Text style={themed(styles.$errorText)}>{error}</Text>
      ) : null}
      <TouchableOpacity
        style={[themed(styles.$button), isSubmitting && themed(styles.$buttonDisabled)]}
        onPress={onSignUpPress}
        disabled={isSubmitting}
      >
        <Text style={themed(styles.$buttonText)}>{isSubmitting ? 'Creating account...' : 'Continue'}</Text>
      </TouchableOpacity>
      <View style={themed(styles.$footer)}>
        <Text style={themed(styles.$footerText)}>Already have an account?</Text>
        <Link href="/sign-in">
          <Text style={themed(styles.$link)}>Sign in</Text>
        </Link>
      </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}