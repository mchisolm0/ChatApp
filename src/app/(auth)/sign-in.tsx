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

  const onSignInPress = async () => {
    if (!isLoaded) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else if(__DEV__) {
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      if(__DEV__) {
        console.error(JSON.stringify(err, null, 2))
      }
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
      <TouchableOpacity
        style={themed(styles.$button)}
        onPress={onSignInPress}
      >
        <Text style={themed(styles.$buttonText)}>Sign in</Text>
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