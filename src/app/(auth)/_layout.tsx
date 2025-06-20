import { Redirect, Stack } from 'expo-router'
import { useConvexAuth } from 'convex/react'

export default function GuestLayout() {
  const { isAuthenticated } = useConvexAuth()

  if (isAuthenticated) {
    return <Redirect href={'/'} />
  }

  return <Stack />
}