import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const listThreadsByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in.");
    }
    const userId = identity.tokenIdentifier;

    return await ctx.db
      .query("threads")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .collect();
  },
});

export const listMessagesByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread_id", (q) => q.eq("thread_id", args.threadId))
      .collect();
  },
});

export const getThreadById = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in.");
    }
    const userId = identity.tokenIdentifier;

    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread not found.");
    }
    if (thread.user_id !== userId) {
      throw new Error("Forbidden: thread does not belong to this user.");
    }
    return thread;
  },
});

export const searchThreadsByTitle = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in.");
    }
    const userId = identity.tokenIdentifier;

    const lower = searchQuery.toLowerCase();

    const threads = await ctx.db
      .query("threads")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .collect();

    return threads.filter((t) => (t.title ?? "").toLowerCase().includes(lower));
  },
});

export const startChatMessagePair = action({
  args: {
    threadId: v.optional(v.id('threads')),
    content: v.string(),
  },
  returns: v.object({
    assistantMessageId: v.id("messages"),
  }),
  handler: async (ctx, { threadId, content }) => {
    if (!threadId) {
      threadId = await ctx.runMutation(api.chat.createThread, {
        error: undefined,
      });
    }

    await ctx.runMutation(api.messages.createMessage, {
      threadId,
      role: 'user',
      content,
      isComplete: true,
    });

    const assistantMessageResult = await ctx.runMutation(api.messages.createMessage, {
      threadId,
      role: 'assistant',
      content: '',
      isComplete: false,
    });

    const assistantMessageId: Id<"messages"> = assistantMessageResult;

    // 3. Schedule the LLM job immediately
    await ctx.scheduler.runAfter(0, internal.llm.generateAssistantMessage, {
      threadId,
      content,
      assistantMessageId,
    });

    return { assistantMessageId };
  },
});

// Generate a succinct title for the thread based on the first message pair
export const generateThreadTitle = action({
  args: { threadId: v.string() },
  handler: async (ctx, { threadId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.tokenIdentifier;

    // Fetch first user & assistant messages
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread_id", (q) => q.eq("thread_id", threadId))
      .order("asc")
      .take(4); // just a few

    if (messages.length === 0) {
      throw new Error("No messages found to generate title");
    }

    const prompt = `Generate a concise (max 6 words) descriptive title for the following conversation:\nUser: ${messages[0]?.content}\nAssistant: ${messages[1]?.content ?? ""}`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Fallback: simple heuristic
      const fallback = messages[0].content.slice(0, 50);
      await ctx.db.patch(threadId, { title: fallback });
      return { title: fallback };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [
          { role: "system", content: "You create short thread titles." },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter title request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const title: string = data.choices?.[0]?.message?.content?.trim() ?? "Untitled Thread";

    await ctx.db.patch(threadId, { title });
    return { title };
  },
});

export const createThread = mutation({
  args: {
    error: v.optional(v.string()),
  },
  returns: v.id("threads"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.tokenIdentifier;

    const defaultTitle = "New Thread";

    const threadId = await ctx.db.insert("threads", {
      user_id: userId,
      created_at: Date.now(),
      updated_at: Date.now(),
      error: args.error ?? null,
      title: defaultTitle,
    });
    return threadId;
  },
});