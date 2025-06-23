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
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/utils/useAppTheme';
import { useSafeAreaInsetsStyle } from '@/utils/useSafeAreaInsetsStyle';
import { type ThemedStyle } from '@/theme';
import { Text } from './Text';

import { useClerk } from '@clerk/clerk-expo';
import { RefreshControl } from 'react-native-gesture-handler';
import { Button } from '@/components/Button';
import { $authButton, $authButtonText } from '@/styles/chat';
import { Authenticated, Unauthenticated } from 'convex/react';
import { useConvexAuth } from 'convex/react';
import { Id } from 'convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Doc } from 'convex/_generated/dataModel';

interface CustomDrawerProps extends DrawerContentComponentProps {
  chatThreads: Doc<'threads'>[];
  onLogin: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

function SignOutButton() {
  const { themed } = useAppTheme()
  const { signOut } = useClerk()

  return (
    <TouchableOpacity
      style={themed($authButton)}
      onPress={() => signOut()}
    >
      <Text style={themed($authButtonText)}>Sign Out</Text>
    </TouchableOpacity>
  )
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
  const { isAuthenticated } = useConvexAuth()
  const { user } = useClerk()
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsetsStyle(["top", "bottom"]);

  const handleRefresh = async () => { };

  const handleThreadPress = useCallback((threadId: Id<'threads'>) => {
    router.push({ pathname: '/[threadId]', params: { threadId } });
    props.navigation.closeDrawer();
  }, [router, props.navigation]);

  // Item component to show each chat thread – hooks allowed here
  const ThreadItem = ({ thread }: { thread: Doc<'threads'> }) => {
    const lastMessage = useQuery(api.messages.getMessages, {
      threadId: thread._id,
      limit: 1,
    });

    return (
      <Button
        style={themed($threadItem)}
        onPress={() => handleThreadPress(thread._id)}
      >
        <Text style={themed($threadTitle)}>{thread.title}</Text>
        {lastMessage && lastMessage.length > 0 && (
          <Text style={themed($lastMessage)} numberOfLines={1}>
            {lastMessage[0].messageChunks[0].content}
          </Text>
        )}
      </Button>
    );
  };

  // Render function for FlatList – NO hooks inside
  const renderChatThread = ({ item }: { item: Doc<'threads'> }) => (
    <ThreadItem thread={item} />
  );

  return (
    <View style={[themed($container), insets]}>
      <View style={themed($topSection)}>
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
          keyExtractor={(t) => t._id}
          renderItem={renderChatThread}
          showsVerticalScrollIndicator={true}
          scrollEnabled
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentInsetAdjustmentBehavior='automatic'
          style={themed($threadList)}
          {...props}
          />
      </View>
      <View style={themed($userSection)}>
        <Authenticated>
          <View style={themed($userInfo)}>
            <View style={themed($user)}>
              <Text style={themed($userName)}>{user?.fullName}</Text>
              <Text style={themed($userEmail)}>{user?.emailAddresses[0].emailAddress}</Text>
            </View>
            <SignOutButton />
          </View>
        </Authenticated>
        <Unauthenticated>
          <Button
            style={themed($loginButton)}
            onPress={() => router.push('/sign-in')}
            tx="drawer:signIn"
          >
          </Button>
        </Unauthenticated>
      </View>
    </View>
  );
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  backgroundColor: theme.colors.palette.neutral100,
  justifyContent: 'space-between',
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

const $topSection: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $threadList: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
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