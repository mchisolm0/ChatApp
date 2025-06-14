import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { ChatInterface } from '@/components/ChatInterface';
import CustomDrawer from '@/components/CustomDrawer';
import { mockChatThreads } from '@/data/mockData';

type RootDrawerParamList = {
  Chat: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredThreads = mockChatThreads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawer
          {...props}
          chatThreads={filteredThreads}
          user={null}
          onLogin={() => {}}
          onLogout={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
    >
      <Drawer.Screen name="Chat" component={ChatInterface} />
    </Drawer.Navigator>
  );
}
