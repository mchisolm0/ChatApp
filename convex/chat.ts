import { FREE_MODELS } from "@/services/models";
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
    threadId: v.id("threads"),
    assistantMessageId: v.id("messages"),
  }),
  handler: async (ctx, { threadId, content }): Promise<{ threadId: Id<"threads">; assistantMessageId: Id<"messages"> }> => {
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

    await ctx.scheduler.runAfter(0, internal.llm.generateAssistantMessage, {
      threadId,
      content,
      assistantMessageId,
    });

    return { threadId, assistantMessageId };
  },
});

export const updateThreadTitle = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
  },
  handler: async (ctx, { threadId, title }) => {
    await ctx.db.patch(threadId, { title });
  },
});

// Generate a succinct title for the thread based on the first message pair
export const generateThreadTitle = action({
  args: { threadId: v.id("threads") },
  returns: v.object({ title: v.string() }),
  handler: async (ctx, { threadId }): Promise<{ title: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.tokenIdentifier;

    // Fetch first user & assistant messages
    const messages = await ctx.runQuery(api.messages.getMessages, {
      threadId,
      limit: 10,
    });

    if (messages.length === 0) {
      throw new Error("No messages found to generate title");
    }

    const userFirst = messages[0]?.messageChunks.map((chunk) => chunk.content).join("") ?? "";
    const assistantFirst = messages[1]?.messageChunks.map((chunk) => chunk.content).join("") ?? "";
    const requestMessages = [
      { role: "system", content: "You create short thread titles. Reply with max-6-word title." },
      { role: "user", content: userFirst },
      { role: "assistant", content: assistantFirst },
    ];

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Fallback: simple heuristic
      const fallbackTitle = userFirst.slice(0, 50);
      await ctx.runMutation(api.chat.updateThreadTitle, {
        threadId,
        title: fallbackTitle,
      });
      return { title: fallbackTitle };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: FREE_MODELS[0],
        messages: requestMessages,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter title request failed: ${response.statusText}`);
    }

    const data = await response.json();
    let title: string = data.choices?.[0]?.message?.content?.trim() || "";
    if (title.length === 0) {
      title = userFirst.slice(0, 50) || "Untitled Thread";
    }

    await ctx.runMutation(api.chat.updateThreadTitle, {
      threadId,
      title,
    });
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