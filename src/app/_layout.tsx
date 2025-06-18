import React, { useEffect, useState } from "react"
import { Slot, SplashScreen } from "expo-router"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { useInitialRootStore } from "@/models"
import { useFonts } from "@expo-google-fonts/space-grotesk"
import { customFontsToLoad } from "@/theme"
import { initI18n } from "@/i18n"
import { loadDateFnsLocale } from "@/utils/formatDate"
import { useThemeProvider } from "@/utils/useAppTheme"
import { ClerkProvider } from "@clerk/clerk-expo"
import "@/utils/polyfills"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { useStores } from "@/models"
import { useRouter, useNavigationContainerRef } from "expo-router"
import { isRunningInExpoGo } from "expo";
import { default as RootLayout } from "@/components/RootLayout"

import * as Sentry from "@sentry/react-native"
import { Platform } from "react-native"

SplashScreen.preventAutoHideAsync()

if (__DEV__ && Platform.OS !== "web") {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts")
}

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://fb0911d35ee81e74104af5adbfda47d6@o4507118738669568.ingest.us.sentry.io/4509505874427905",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    navigationIntegration,
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
})

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary"

export default Sentry.wrap(function Root() {
  // Wait for stores to load and render our layout inside of it so we have access
  // to auth info etc
  const { rehydrated } = useInitialRootStore()
  const { chatStore } = useStores()

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { themeScheme, setThemeContextOverride, ThemeProvider } = useThemeProvider()
  const router = useRouter()

  const ref = useNavigationContainerRef();
  React.useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  const filteredThreads = chatStore.threadsArray.filter((thread) =>
    (thread.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleLogin = () => {
    router.push("/sign-in")
  }

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  const loaded = fontsLoaded && isI18nInitialized && rehydrated

  useEffect(() => {
    if (fontError) throw fontError
  }, [fontError])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string} tokenCache={tokenCache}>
      <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
        <KeyboardProvider>
          <RootLayout />
        </KeyboardProvider>
      </ThemeProvider>
    </ClerkProvider>
  )
})
