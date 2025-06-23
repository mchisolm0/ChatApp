import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { useConvexAuth } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Redirect } from 'expo-router';

export default function ChatScreen() {
  const router = useRouter()

  const { isAuthenticated, isLoading } = useConvexAuth();

  const [searchQuery, setSearchQuery] = useState("")

  if (!isAuthenticated || isLoading) {
    return <Redirect href={'/sign-in'} />
  }

  const filteredThreads = useQuery(api.chat.searchThreadsByTitle, {
    searchQuery,
  })

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
          chatThreads={filteredThreads}
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
          headerRight: () => (
            <TouchableOpacity
              style={{
                backgroundColor: '#D97D54',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 16,
              }}
              onPress={() => router.push('/')}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>New Chat</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer>
  );
}