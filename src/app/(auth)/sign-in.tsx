import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Screen } from '@/components'
import React from 'react'
import { useAppTheme } from '../../utils/useAppTheme'
import * as styles from '../../styles/auth'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')

  const onSignInPress = async () => {
    if (!isLoaded) return
    
    // Validate inputs
    if (!emailAddress.trim() || !password.trim()) {
      setError('Please enter both email and password')
      return
    }
    
    setIsSubmitting(true)
    setError('')

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        setError('Sign-in incomplete. Please try again.')
      }
    } catch (err: any) {
      // Provide more specific error messages based on the error
      const errorMessage = err?.errors?.[0]?.message || 'Invalid email or password. Please try again.'
      setError(errorMessage)
      if (__DEV__) {
        console.error('Sign-in error:', err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  const { themed } = useAppTheme()

  return (
    <Screen safeAreaEdges={['top', 'bottom']} contentContainerStyle={themed(styles.$container)}>
      <Text style={themed(styles.$title)}>Sign in</Text>
      <KeyboardAvoidingView>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          style={themed(styles.$input)}
          onChangeText={setEmailAddress}
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          secureTextEntry
          style={themed(styles.$input)}
          onChangeText={setPassword}
        />
        {error ? (
          <Text style={themed(styles.$errorText)}>{error}</Text>
        ) : null}
        <TouchableOpacity
          style={[themed(styles.$button), isSubmitting && themed(styles.$buttonDisabled)]}
          onPress={onSignInPress}
          disabled={isSubmitting}
        >
          <Text style={themed(styles.$buttonText)}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>
        <View style={themed(styles.$footer)}>
          <Text style={themed(styles.$footerText)}>Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <Text style={themed(styles.$link)}>Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}
