import { supabase } from "@/utils/supabaseClient"
import { rootStore } from "@/models/storeSetup"
import {
  ChatMessageSnapshotIn,
  ChatThreadSnapshotIn,
} from "@/models/ChatStore"

/**
 * Pull the latest threads (and their messages) for the current user (or anonymous).
 * Any new data is merged into MobX‐State‐Tree and will subsequently persist to MMKV.
 */
export async function pullThreads(currentUserId: string | null) {
  // Fetch threads belonging to the user OR anonymous threads when signed out.
  const { data: threads, error: threadErr } = await supabase
    .from("threads")
    .select("*")
    .or(
      currentUserId
        ? `user_id.eq.${currentUserId}`
        : "user_id.is.null", // anon only
    )

  if (threadErr) throw threadErr

  if (!threads || threads.length === 0) return

  // Fetch messages for those thread IDs in one query.
  const threadIds = threads.map((t) => t.id)
  const { data: messages, error: msgErr } = await supabase
    .from("messages")
    .select("*")
    .in("thread_id", threadIds)

  if (msgErr) throw msgErr

  // Group messages by threadId for quick lookup.
  const msgsByThread: Record<string, ChatMessageSnapshotIn[]> = {}
  messages?.forEach((m) => {
    ;(msgsByThread[m.thread_id] ||= []).push({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: new Date(m.created_at),
    })
  })

  // Merge threads into the store.
  threads.forEach((t) => {
    const threadSnapshot: ChatThreadSnapshotIn = {
      id: t.id,
      userId: t.user_id,
      title: t.title,
      createdAt: new Date(t.created_at),
      updatedAt: new Date(t.updated_at),
      messages: msgsByThread[t.id] ?? [],
    }
    rootStore.addThread(threadSnapshot)
  })
}

/**
 * Push (insert or update) a thread row to Supabase.
 * Returns the upserted row or throws on error.
 */
export async function pushThread(thread: ChatThreadSnapshotIn) {
  const { error, data } = await supabase.from("threads").upsert(
    {
      id: thread.id,
      user_id: thread.userId,
      title: thread.title,
      created_at: thread.createdAt,
      updated_at: thread.updatedAt,
    },
    { onConflict: "id" },
  )
  if (error) throw error
  return data?.[0]
}

/**
 * Push a message to Supabase (insert only; updates handled by upserting again).
 */
export async function pushMessage(
  threadId: string,
  message: ChatMessageSnapshotIn,
) {
  const { error, data } = await supabase.from("messages").upsert(
    {
      id: message.id,
      thread_id: threadId,
      role: message.role,
      content: message.content,
      created_at: message.createdAt,
    },
    { onConflict: "id" },
  )
  if (error) throw error
  return data?.[0]
}

/**
 * Subscribe to realtime changes for the current user's threads/messages.
 * Optionally call the provided callback any time data changes.
 */
export function subscribeToRealtime(currentUserId: string | null, onChange?: () => void) {
  // Realtime channel (Postgres Changes) requires the replicated schema.
  const channel = supabase.channel("threads_messages")

  // Listen to both tables; filters handled by RLS automatically.
  channel
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "threads" },
      (_payload) => {
        // Simply re-pull; easiest for now.
        pullThreads(currentUserId).finally(() => onChange?.())
      },
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages" },
      (_payload) => {
        pullThreads(currentUserId).finally(() => onChange?.())
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
