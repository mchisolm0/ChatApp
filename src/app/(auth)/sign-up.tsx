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

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
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
        <TouchableOpacity style={themed(styles.$button)} onPress={onVerifyPress}>
          <Text style={themed(styles.$buttonText)}>Verify</Text>
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
      <TouchableOpacity style={themed(styles.$button)} onPress={onSignUpPress}>
        <Text style={themed(styles.$buttonText)}>Continue</Text>
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