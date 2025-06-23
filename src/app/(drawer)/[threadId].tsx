import { useLocalSearchParams } from 'expo-router';
import { ChatInterface } from '@/components/ChatInterface';
import { Id } from 'convex/_generated/dataModel';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ threadId?: Id<'threads'> }>();
  const threadId = params.threadId ?? undefined;

  return <ChatInterface threadId={threadId} />;
}