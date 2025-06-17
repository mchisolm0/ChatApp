import React, { useState } from 'react';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { ThemedStyle } from '@/theme';
import { ViewStyle } from 'react-native';
import { ChatInterface } from '@/components/ChatInterface';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';
import { useStores } from '@/models';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const { themed } = useAppTheme()

  const router = useRouter()

  const { chatStore } = useStores()

  const [searchQuery, setSearchQuery] = useState("")

  const filteredThreads = chatStore.threadsArray.filter((thread) =>
    (thread.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleLogin = () => {
    router.push("/sign-in")
  }

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
      drawerContent={(props) => (
        <CustomDrawer
          {...props}
          chatThreads={filteredThreads as any}
          onLogin={handleLogin}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}
    >
      <Drawer.Screen
        name="/"
        options={{
          drawerLabel: "Create New Chat",
          title: "Create New Chat",
        }}
      />
      <Drawer.Screen
        name="[threadId]"
        options={{
          drawerLabel: "Chat Thread",
          title: "Chat Thread",
        }}
      />
    </Drawer>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})