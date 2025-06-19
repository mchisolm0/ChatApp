import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(emailAddress, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
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
    </Screen>
  )
}