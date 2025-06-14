import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Message model representing a single chat message.
 */
export const ChatMessageModel = types
  .model("ChatMessage", {
    id: types.identifier,
    role: types.enumeration("Role", ["user", "assistant", "system"]),
    content: types.string,
    createdAt: types.Date,
  })
  .actions(withSetPropAction)

export interface ChatMessage extends Instance<typeof ChatMessageModel> { }
export interface ChatMessageSnapshotIn extends SnapshotIn<typeof ChatMessageModel> { }
export interface ChatMessageSnapshotOut extends SnapshotOut<typeof ChatMessageModel> { }

/**
 * Thread model that holds many messages.
 */
export const ChatThreadModel = types
  .model("ChatThread", {
    id: types.identifier,
    title: types.string,
    createdAt: types.Date,
    updatedAt: types.Date,
    messages: types.array(ChatMessageModel),
  })
  .views((self) => ({
    get lastMessage() {
      return self.messages.length > 0 ? self.messages[self.messages.length - 1] : undefined
    },
  }))
  .actions((self) => ({
    addMessage(message: ChatMessageSnapshotIn) {
      const existing = self.messages.find((m) => m.id === message.id)
      if (existing) {
        // update content for streaming messages
        existing.content = message.content
        self.updatedAt = new Date()
        return
      }
      // avoid duplicates

      self.messages.push(message as ChatMessageSnapshotIn)
      self.updatedAt = new Date()
    },
  }))

export interface ChatThread extends Instance<typeof ChatThreadModel> { }
export interface ChatThreadSnapshotIn extends SnapshotIn<typeof ChatThreadModel> { }
export interface ChatThreadSnapshotOut extends SnapshotOut<typeof ChatThreadModel> { }

/**
 * Store that manages chat threads.
 */
export const ChatStoreModel = types
  .model("ChatStore", {
    threads: types.map(ChatThreadModel),
  })
  .views((self) => ({
    get threadsArray() {
      return Array.from(self.threads.values()).sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      )
    },
  }))
  .actions((self) => ({
    addThread(thread: ChatThreadSnapshotIn) {
      if (!self.threads.has(thread.id)) {
        self.threads.set(thread.id, thread as ChatThreadSnapshotIn)
      }
    },
    addMessageToThread(threadId: string, message: ChatMessageSnapshotIn, title?: string) {
      // ensure thread exists
      if (!self.threads.has(threadId)) {
        this.addThread({
          id: threadId,
          title: title ?? "New chat",
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
        } as ChatThreadSnapshotIn)
      }
      const thread = self.threads.get(threadId) as ChatThread
      thread.addMessage(message)
    },
  }))

export interface ChatStore extends Instance<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotIn extends SnapshotIn<typeof ChatStoreModel> { }
export interface ChatStoreSnapshotOut extends SnapshotOut<typeof ChatStoreModel> { }
