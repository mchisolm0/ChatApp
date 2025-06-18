import { useLocalSearchParams } from 'expo-router';
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ threadId?: string | string[] }>();
  const threadId = Array.isArray(params.threadId)
    ? params.threadId[0]
    : params.threadId ?? "";

  return <ChatInterface threadId={threadId} />;
}