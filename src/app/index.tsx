import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { Screen } from '@/components';
import { useAppTheme } from '@/utils/useAppTheme';
import { Drawer } from 'expo-router/drawer';
import CustomDrawer from '@/components/CustomDrawer';

import { useState, useEffect } from 'react';
import { ThemedStyle } from '@/theme';
import { ViewStyle } from 'react-native';

export default function ChatScreen() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme()

  const [chatThreads, setChatThreads] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Your data fetching logic here
  useEffect(() => {
    // Fetch chat threads and user data
    // This is where you'd integrate with your backend/state management
  }, []);

  const handleLogin = () => {
    // Navigate to login screen or show login modal
    console.log('Login pressed');
  };

  const handleLogout = () => {
    // Handle logout logic
    setUser(null);
  };

  const filteredThreads = chatThreads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Screen safeAreaEdges={["top", "bottom"]} contentContainerStyle={themed($container)}>

      <Drawer
        drawerContent={(props) => (
          <CustomDrawer
            {...props}
            chatThreads={filteredThreads}
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
          />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Chat App',
          }}
        />
      </Drawer>
    </Screen>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 9,
  display: 'flex',
  flexDirection: 'column',
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: 'absolute',
  bottom: '100%',
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.error,
  padding: spacing.xs,
  borderRadius: spacing.xs,
  marginBottom: spacing.xs
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  textAlign: 'center'
})

const $input: ThemedStyle<TextStyle> = ({ spacing }) => ({
  backgroundColor: 'white',
  margin: spacing.md,
  padding: spacing.md
})