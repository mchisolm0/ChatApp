import React, { useState } from 'react';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { useConvexAuth } from 'convex/react';
import { api } from 'convex/_generated/api';
import { type ChatThread } from '@/models/ChatStore';

export default function ChatScreen() {
  const router = useRouter()

  const { isAuthenticated, isLoading } = useConvexAuth();

  const [searchQuery, setSearchQuery] = useState("")

  const filteredThreads = useQuery(api.threads.searchThreadsByTitle, {
    searchQuery,
  })

  // Ensure we always pass a ChatThread[] to the drawer, falling back to an empty array while the query is loading
  const chatThreads = (filteredThreads ?? []) as unknown as ChatThread[]

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
          chatThreads={chatThreads}
          onLogin={handleLogin}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      )}
    >
      <Drawer.Screen
        name="index"
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