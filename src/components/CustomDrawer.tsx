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
import { useSafeAreaInsetsStyle } from '@/utils/useSafeAreaInsetsStyle';
import { type ThemedStyle } from '@/theme';

// interface ChatThread {
//   id: string;
//   title: string;
//   lastMessage?: string;
// }
import { ChatThread } from '@/data/mockData';
import { SignOutButton } from './SignOutButton';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useStores } from '@/models';

interface CustomDrawerProps extends DrawerContentComponentProps {
  chatThreads: ChatThread[];
  onLogin: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export default function CustomDrawer({
  chatThreads,
  onLogin,
  onSearchChange,
  searchQuery,
  ...props
}: CustomDrawerProps) {
  const { themed } = useAppTheme();
  const containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const router = useRouter();
  const { authStore } = useStores();

  const handleThreadPress = useCallback((threadId: string) => {
    router.push({ pathname: '/[threadId]', params: { threadId } });
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
    <View style={[themed($container), containerInsets]}>
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
        <SignedIn>
          <View style={themed($userInfo)}>
            <View style={themed($user)}>
              <Text style={themed($userName)}>{authStore.username}</Text>
              <Text style={themed($userEmail)}>{authStore.emailAddress}</Text>
            </View>
            <SignOutButton />
          </View>
        </SignedIn>
        <SignedOut>
          <TouchableOpacity style={themed($loginButton)} onPress={() => router.push('/sign-in')}>
            <Text style={themed($loginText)}>Sign In</Text>
          </TouchableOpacity>
        </SignedOut>
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
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'row',
})

const $user: ThemedStyle<ViewStyle> = (theme) => ({
  alignItems: 'flex-start',
  justifyContent: 'center',
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