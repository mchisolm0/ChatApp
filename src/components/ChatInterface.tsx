import { View, TextInput, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useSafeAreaInsetsStyle } from '@/utils/useSafeAreaInsetsStyle';
import { useAppTheme } from '@/utils/useAppTheme';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { $modalOverlay, $errorContainer, $errorText } from '@/styles/common';
import {
  $chatContainer,
  $chatTopContainer,
  $modelSelector,
  $modelPicker,
  $messageContainer,
  $roleText,
  $messageText,
  $bottomContainer,
  $pickerText,
  $pickerModal,
  $pickerOption,
  $pickerOptionText,
  $chatInput,
  $messagesScroll,
} from '@/styles/chat';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useAction, useConvexAuth, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { Message } from './Message';
import { Id } from 'convex/_generated/dataModel';

interface ChatInterfaceProps {
  threadId?: Id<'threads'>;
  apiEndpoint?: string;
}

const AVAILABLE_MODELS = [
  'openai/gpt-4',
  'openai/gpt-3.5-turbo',
  'anthropic/claude-2',
  'google/palm-2-chat-bison',
  'meta-llama/llama-2-70b-chat',
];

const FREE_MODELS = [
  'google/gemma-3-4b-it:free',
  'google/gemma-3-12b-it:free',
  'rekaai/reka-flash-3:free',
  'microsoft/phi-4-reasoning-plus-04-30:free',
  'google/gemini-2.5-pro-exp-03-25',
  'google/gemma-3-27b-it',
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.0-flash-001',
];

export const ChatInterface = observer(function ChatInterface({ threadId }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState(FREE_MODELS[0]);
  const [isModelPickerVisible, setIsModelPickerVisible] = useState(false);

  const { theme, themed } = useAppTheme();
  const insets = useSafeAreaInsetsStyle(['bottom']);

  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated } = useConvexAuth();

  const startChat = useAction(api.chat.startChatMessagePair);
  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      setIsSending(true);
      await startChat({
        threadId,
        content: input,
      });
      setInput('');
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err as Error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async () => {
    await sendMessage();
  };

  const messages = useQuery(
    api.messages.getMessages,
    threadId ? { threadId, limit: 10 } : "skip"
  );

  return (
    <KeyboardAvoidingView style={[themed($chatContainer), insets]}>
      <View style={themed($chatTopContainer)}>
        <View style={themed($modelSelector)}>
          <TouchableOpacity
            style={themed($modelPicker)}
            onPress={() => setIsModelPickerVisible(true)}
          >
            <Text style={themed($pickerText)}>{selectedModel}</Text>
          </TouchableOpacity>
          <Modal
            visible={isModelPickerVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setIsModelPickerVisible(false)}
          >
            <TouchableOpacity
              style={themed($modalOverlay)}
              onPress={() => setIsModelPickerVisible(false)}
              activeOpacity={1}
            >
              <View style={themed($pickerModal)}>
                {FREE_MODELS.map(model => (
                  <TouchableOpacity
                    key={model}
                    style={themed($pickerOption)}
                    onPress={() => {
                      setSelectedModel(model);
                      setIsModelPickerVisible(false);
                    }}
                  >
                    <Text style={themed($pickerOptionText)}>{model}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <FlatList
          style={themed($messagesScroll)}
          data={messages ?? []}
          keyExtractor={(message) => message._id}
          renderItem={({item: message}) => (
            <Message
              key={message._id}
              role={message.role}
              content={message.messageChunks.map((chunk: { content: string }) => chunk.content).join('')}
              isComplete={message.isComplete}
            />
          )}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          showsVerticalScrollIndicator={true}
        />
      </View>
      <View style={themed($bottomContainer)}>
        {error && (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)}>{error.message}</Text>
          </View>
        )}
        <TextInput
          style={themed($chatInput)}
          placeholder="Ask me anything..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSubmit()}
          editable={!isSending}
          autoFocus={true}
        />
      </View>
    </KeyboardAvoidingView>
  );
});


