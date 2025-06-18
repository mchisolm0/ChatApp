// components/CustomDrawer.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
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
import { Text } from './Text';

import { ChatThread } from '@/data/mockData';
import { SignOutButton } from './SignOutButton';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import { useStores } from '@/models';
import { RefreshControl } from 'react-native-gesture-handler';
import { Button } from './Button';

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
  const router = useRouter();
  const { authStore } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);

  const handleRefresh = async () => { };

  const handleThreadPress = useCallback((threadId: string) => {
    router.push({ pathname: '/[threadId]', params: { threadId } });
    props.navigation.closeDrawer();
  }, [router, props.navigation]);

  const renderChatThread = ({ item }: { item: ChatThread }) => {
    const lastMessage = item.messages[item.messages.length - 1];
    return (
      <Button
        style={themed($threadItem)}
        onPress={() => handleThreadPress(item.id)}
        text={item.title}
      >
        {lastMessage && (
          <Text
            style={themed($lastMessage)}
            numberOfLines={1}>
            text={lastMessage.content}
          </Text>
        )}
      </Button>
    );
  };

  return (
    <View style={[themed($container), insets]}>
      <View style={themed($searchContainer)}>
        <TextInput
          style={themed($searchInput)}
          placeholder="Search chats…"
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#666"
        />
      </View>
      <FlatList
        data={chatThreads}
        keyExtractor={(t) => t.id}
        renderItem={renderChatThread}
        showsVerticalScrollIndicator={true}
        scrollEnabled
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={themed($container)}
        {...props}
      />
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
          <Button
            style={themed($loginButton)}
            onPress={() => router.push('/sign-in')}
            tx="drawer:signIn"
          >
          </Button>
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