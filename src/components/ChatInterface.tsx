import { generateAPIUrl } from '@/utils/generateAPIRoutes';
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, TouchableOpacity, Modal } from 'react-native';
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

interface ChatInterfaceProps {
  threadId?: string;
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

export const ChatInterface = observer(function ChatInterface({ threadId = 'default', apiEndpoint = '/api/chat' }: ChatInterfaceProps) {
  const [selectedModel, setSelectedModel] = useState(FREE_MODELS[0]);
  const [isModelPickerVisible, setIsModelPickerVisible] = useState(false);

  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl(apiEndpoint),
    body: {
      modelName: selectedModel,
    },
    onError: error => console.error(error, 'ERROR'),
  });

  const { theme, themed } = useAppTheme();

  return (
    <View style={themed($chatContainer)}>
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
        <ScrollView style={themed($messagesScroll)}>
          {messages.map(m => (
            <View key={m.id} style={themed($messageContainer)}>
              <View>
                <Text style={themed($roleText)}>{m.role}</Text>
                <Text style={themed($messageText)}>{m.content}</Text>
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
        <TextInput
          style={themed($chatInput)}
          placeholder="Ask me anything..."
          value={input}
          onChange={e =>
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: e.nativeEvent.text,
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          onSubmitEditing={e => {
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
        />
      </View>
    </View>
  );
});


