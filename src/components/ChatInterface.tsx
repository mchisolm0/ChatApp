import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { Button, Text, TextField, TextFieldAccessoryProps } from "@/components";
import { ThemedStyle } from "@/theme";
import { useAppTheme } from "@/utils/useAppTheme";
import { generateAPIUrl } from '@/utils/utils';
import { useChat } from '@ai-sdk/react';
import { useStores } from '@/models';
import { fetch as expoFetch } from 'expo/fetch';
import { useRouter } from 'expo-router';
import { useNavigation, DrawerActions } from '@react-navigation/native';

import { useHeader } from '@/utils/useHeader';
import { translate } from '@/i18n';
import Drawer from 'expo-router/drawer';
import CustomDrawer from './CustomDrawer';

interface ChatInterfaceProps {
  threadId?: string;
  apiEndpoint?: string;
}

export function ChatInterface({ threadId, apiEndpoint = '/api/chat' }: ChatInterfaceProps) {

  const { chatStore } = useStores()

  // Retrieve the persisted thread (if any) that matches the current thread id
  const currentThread = threadId ? chatStore.threads.get(threadId) : undefined

  // Header with new chat button
  const router = useRouter()
  const navigation = useNavigation()

  const onAddThread = () => {
    const newId = `thread_${Date.now()}`
    chatStore.addThread({
      id: newId,
      title: 'New Chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    })
    router.push(`/${newId}`)
  }
  useHeader(
    {
      title: currentThread?.title ?? 'New Chat',
      leftIcon: 'menu',
      onLeftPress: () => navigation.dispatch(DrawerActions.toggleDrawer()),
      rightText: '+',
      onRightPress: onAddThread,
    },
    [currentThread?.id],
  )



  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl(apiEndpoint),
    id: threadId,
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme();

  // choose messages from store for existing thread or live hook
  const displayedMessages = currentThread ? currentThread.messages.slice() : messages;

  // Persist messages to local store whenever messages array changes
  // Use content string to trigger on streaming updates
  const msgContents = messages.map(m => m.content).join('')
  useEffect(() => {
    if (messages.length === 0) return

    // If we don't yet have a thread id (new chat), generate one
    let id = threadId
    if (!id) {
      id = `thread_${Date.now()}`
    }

    // Use first user message (if available) as a provisional title
    const firstUserMsg = messages.find((m) => m.role === 'user')?.content ?? 'New chat'

    const existingIds = new Set(currentThread?.messages.map((m) => m.id))
    messages.forEach((m) => {
      if (existingIds.has(m.id)) return
      chatStore.addMessageToThread(
        id!,
        {
          id: m.id,
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
          createdAt: new Date(),
        },
        firstUserMsg,
      )
    })
  }, [msgContents])


  return (
    <View style={themed($container)}>
      <View style={themed($topContainer)}>
        <ScrollView style={{ flex: 1 }}>
          {displayedMessages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text style={{ fontWeight: '700' }}>{m.role}</Text>
                <Text>{m.content}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={themed($bottomContainer)}>
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)}>{error.message}</Text>
          </View>
        )}
        <TextField
          placeholderTx='chatScreen:placeholderText'
          value={input}
          multiline
          onChange={e =>
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: e.nativeEvent.text,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          autoFocus={true}
          RightAccessory={useCallback(
            (props: TextFieldAccessoryProps) => (
              <Button
                preset="filled"
                tx="chatScreen:sendButton"
                onPress={(e) => {
                  handleSubmit(e);
                  e.preventDefault();
                }}
                style={{ height: 40, marginEnd: 0 }}
              />
            ),
            [handleSubmit]
          )}
        />
      </View>
    </View>
  );
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
});

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
});

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
  marginTop: 'auto',
});

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: 'absolute',
  bottom: '100%',
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.error,
  padding: spacing.xs,
  borderRadius: spacing.xs,
  marginBottom: spacing.xs
});

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  textAlign: 'center'
});


