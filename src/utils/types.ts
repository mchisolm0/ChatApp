/**
 * Chat roles that align with the OpenAI / Vercel AI SDK conventions.
 */
export type Role = "user" | "assistant" | "system";

/**
 * Basic user profile. Extend this as your auth layer grows.
 */
export interface User {
  /** Primary key – ideally a UUID */
  id: string;
  /** Display name shown in the UI */
  name: string;
  /** Optional avatar/profile picture URL */
  avatarUrl?: string;
  /** Account creation time */
  createdAt: Date;
}

/**
 * Single chat message.
 */
export interface Message {
  /** Primary key */
  id: string;
  /** FK → Thread.id */
  threadId: string;
  /** FK → User.id of the sender */
  senderId: string;
  /** Sender role ("user", "assistant", etc.) */
  role: Role;
  /** Raw message content (Markdown supported) */
  content: string;
  /** Creation timestamp */
  createdAt: Date;
}

/**
 * A conversation thread, consisting of many messages.
 */
export interface Thread {
  /** Primary key */
  id: string;
  /** Optional human-readable title */
  title?: string;
  /** Participant user IDs (useful for group chats later) */
  participantIds: string[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last message timestamp */
  updatedAt: Date;
  /** Messages ordered oldest → newest */
  messages: Message[];
}
