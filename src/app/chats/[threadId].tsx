import { useLocalSearchParams } from 'expo-router';
import { ChatInterface } from '@/components/ChatInterface';

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  return <ChatInterface threadId={threadId} />;
}