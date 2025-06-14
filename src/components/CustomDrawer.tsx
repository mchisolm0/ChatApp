// components/CustomDrawer.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/utils/useAppTheme';
import { type ThemedStyle } from '@/theme';

// interface ChatThread {
//   id: string;
//   title: string;
//   lastMessage?: string;
// }
import { ChatThread } from '@/data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CustomDrawerProps extends DrawerContentComponentProps {
  chatThreads: ChatThread[];
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export default function CustomDrawer({
  chatThreads,
  user,
  onLogin,
  onLogout,
  onSearchChange,
  searchQuery,
  ...props
}: CustomDrawerProps) {
  const { themed } = useAppTheme();
  const router = useRouter();

  const handleThreadPress = useCallback((threadId: string) => {
    router.push(`/chats/${threadId}`);
    props.navigation.closeDrawer();
  }, [router, props.navigation]);

  const renderChatThread = ({ item }: { item: ChatThread }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    return (
      <TouchableOpacity
        style={themed($threadItem)}
        onPress={() => handleThreadPress(item.id)}
      >
        <Text style={themed($threadTitle)} numberOfLines={1}>
          {item.title}
        </Text>
        {lastMessage && (
          <Text style={themed($lastMessage)} numberOfLines={1}>
            {lastMessage.content}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={themed($container)}>
      {/* Search Section */}
      <View style={themed($searchContainer)}>
        <TextInput
          style={themed($searchInput)}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#666"
        />
      </View>

      {/* Chat Threads List */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={themed($scrollContent)}
      >
        <FlatList
          data={chatThreads}
          renderItem={renderChatThread}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </DrawerContentScrollView>

      {/* User Section */}
      <View style={themed($userSection)}>
        {user ? (
          <View style={themed($userInfo)}>
            <Text style={themed($userName)}>{user.name}</Text>
            <Text style={themed($userEmail)}>{user.email}</Text>
            <TouchableOpacity style={themed($logoutButton)} onPress={onLogout}>
              <Text style={themed($logoutText)}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={themed($loginButton)} onPress={onLogin}>
            <Text style={themed($loginText)}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.palette.neutral100,
})

const $searchContainer: ThemedStyle<ViewStyle> = (theme) => ({
  padding: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.palette.neutral300,
})

const $searchInput: ThemedStyle<TextStyle> = (theme) => ({
  height: 40,
  borderWidth: 1,
  borderColor: theme.colors.palette.neutral300,
  borderRadius: theme.spacing.sm,
  paddingHorizontal: theme.spacing.sm,
  fontSize: 16,
})

const $scrollContent: ThemedStyle<ViewStyle> = () => ({
  flexGrow: 1,
})

const $threadItem: ThemedStyle<ViewStyle> = (theme) => ({
  padding: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.palette.neutral300,
})

const $threadTitle: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.colors.palette.neutral800,
  marginBottom: theme.spacing.xxs,
})

const $lastMessage: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  color: theme.colors.palette.neutral600,
})

const $userSection: ThemedStyle<ViewStyle> = (theme) => ({
  padding: theme.spacing.md,
  borderTopWidth: 1,
  borderTopColor: theme.colors.palette.neutral300,
})

const $userInfo: ThemedStyle<ViewStyle> = () => ({
  alignItems: 'flex-start',
})

const $userName: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 16,
  fontWeight: '600',
  color: theme.colors.palette.neutral800,
  marginBottom: theme.spacing.xxs,
})

const $userEmail: ThemedStyle<TextStyle> = (theme) => ({
  fontSize: 14,
  color: theme.colors.palette.neutral600,
  marginBottom: theme.spacing.sm,
})

const $loginButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.primary500,
  paddingVertical: theme.spacing.sm,
  paddingHorizontal: theme.spacing.lg,
  borderRadius: theme.spacing.sm,
  alignItems: 'center',
})

const $loginText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral100,
  fontSize: 16,
  fontWeight: '600',
})

const $logoutButton: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.palette.neutral200,
  paddingVertical: theme.spacing.xs,
  paddingHorizontal: theme.spacing.md,
  borderRadius: theme.spacing.xs,
})

const $logoutText: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.palette.neutral600,
  fontSize: 14,
})