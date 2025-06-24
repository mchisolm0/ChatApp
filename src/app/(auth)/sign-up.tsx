import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import { useWarmUpBrowser } from '../../utils/useWarmUpBrowser'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

import { Screen } from '@/components'
import { UsernameModal } from '@/components/UsernameModal'
import { useSignUp, useSSO } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useAppTheme } from '../../utils/useAppTheme'
import * as styles from '../../styles/auth'

export default function SignUpScreen() {
  const { isLoaded: signUpLoaded, signUp, setActive: setActiveSignUp } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showUsernameModal, setShowUsernameModal] = React.useState(false)
  const [pendingSignUp, setPendingSignUp] = React.useState<any>(null)


  // Apple SSO
  const { startSSOFlow } = useSSO();

  // Warm-up browser
  useWarmUpBrowser();

  const onApplePress = React.useCallback(async () => {
    if (!signUpLoaded) return;
    try {
      const { createdSessionId, signUp: signUpAttempt, setActive: setActiveSSO } = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl: AuthSession.makeRedirectUri(
          {
            scheme: 'chatapp',
            path: '/',
          }
        ),
      });
      if (createdSessionId && setActiveSSO) {
        await setActiveSSO({ session: createdSessionId });
      } else if (signUpAttempt && signUpAttempt.status !== 'complete') {
        setPendingSignUp(signUpAttempt);
        setShowUsernameModal(true);
      }
    } catch (err) {
      if (__DEV__) {
        console.error('Apple SSO error:', err);
      }
      setError('Apple sign-up failed. Please try again.');
    }
  }, [signUpLoaded, startSSOFlow]);

  const onUsernameSubmit = React.useCallback(
    async (username: string) => {
      try {
        setIsSubmitting(true);
        setError('');

        if (pendingSignUp) {
          const updatedSignUp = await pendingSignUp.update({ username });

          if (updatedSignUp.status === 'complete') {
            await setActiveSignUp!({ session: updatedSignUp.createdSessionId });
            setShowUsernameModal(false);
            setPendingSignUp(null);
          }
        }
      } catch (err: any) {
        const message = err?.errors?.[0]?.message || 'Failed to set username. Please try again.';
        setError(message);
        if (__DEV__) {
          console.error('Username update error:', err);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [pendingSignUp, setActiveSignUp],
  );

  const onSignUpPress = async () => {
    if (!signUpLoaded) return

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
        username,
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
    if (!signUpLoaded) return

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
        await setActiveSignUp!({ session: signUpAttempt.createdSessionId })
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
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={{ width: '100%' }}>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        style={themed(styles.$input)}
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        style={themed(styles.$input)}
        onChangeText={(username) => setUsername(username)}
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
      {/* Apple SSO */}
      <TouchableOpacity
        style={themed(styles.$button)}
        onPress={onApplePress}
      >
        <Text style={themed(styles.$buttonText)}>Continue with Apple</Text>
      </TouchableOpacity>
      <View style={themed(styles.$footer)}>
        <Text style={themed(styles.$footerText)}>Already have an account?</Text>
        <Link href="/sign-in">
          <Text style={themed(styles.$link)}>Sign in</Text>
        </Link>
      </View>
      </KeyboardAvoidingView>
      <UsernameModal
        visible={showUsernameModal}
        onClose={() => {
          setShowUsernameModal(false);
          setPendingSignUp(null);
          setError('');
        }}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={onUsernameSubmit}
      />
    </Screen>
  )
}