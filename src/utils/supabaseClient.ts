import { createClient } from "@supabase/supabase-js"

// Supabase credentials are provided via Expo public env variables so they are
// embedded at build time for web and available via expo-constants in native.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase credentials are missing. Did you forget to set them in your .env or expo config?",
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Persist session automatically across app reloads.
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
