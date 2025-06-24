import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';

// Complete any pending auth sessions (needed for Expo/iOS)
WebBrowser.maybeCompleteAuthSession();

/**
 * Pre-warms Expo WebBrowser on mount (mainly for Android) to reduce
 * the perceived latency when an OAuth / SSO flow opens the browser.
 * Automatically cools down when the component unmounts.
 *
 * As per Clerk + Expo guidance:
 * https://clerk.com/docs/references/expo/use-sso#how-to-use-the-usesso-hook
 */

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preload browser
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
