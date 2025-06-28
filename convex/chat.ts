import { FREE_MODELS } from "@/services/models";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

import { generateText, CoreMessage, streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

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
  args: { threadId: v.id("threads"), userId: v.string() },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread not found.");
    }
    if (thread.user_id !== args.userId) {
      throw new Error("Forbidden: thread does not belong to this user.");
    }
    return thread;
  },
});

export const searchThreadsByTitle = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthorized: Please sign in.");
    }
    const userId = identity.tokenIdentifier;

    const lower = searchQuery.toLowerCase();

    const threads = await ctx.db
      .query("threads")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .order("desc")
      .collect();

    return threads.filter((t) => (t.title ?? "").toLowerCase().includes(lower));
  },
});

export const startChatMessagePair = action({
  args: {
    threadId: v.optional(v.id('threads')),
    content: v.string(),
    model: v.optional(v.string()),
  },
  returns: v.object({
    threadId: v.id("threads"),
    assistantMessageId: v.id("messages"),
  }),
  handler: async (ctx, { threadId, content, model }): Promise<{ threadId: Id<"threads">; assistantMessageId: Id<"messages"> }> => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.tokenIdentifier;
    if (!userId) {
      throw new Error("Unauthorized: Please sign in.");
    }
    if (!threadId) {
      threadId = await ctx.runMutation(api.chat.createThread, {
        error: undefined,
        userId,
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

    if (!model) {
      model = FREE_MODELS[0];
    }

    await ctx.scheduler.runAfter(0, internal.llm.generateAssistantMessage, {
      threadId,
      userId,
      content,
      model,
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
    await ctx.db.patch(threadId, { title: title });
  },
});

// Generate a succinct title for the thread based on the first message pair
export const generateThreadTitle = action({
  args: { threadId: v.id("threads"), userId: v.string() },
  returns: v.object({ title: v.string() }),
  handler: async (ctx, { threadId, userId }): Promise<{ title: string }> => {
    const thread = await ctx.runQuery(api.chat.getThreadById, { threadId, userId });
    if (!thread) {
      throw new Error("Thread not found");
    }
    // Fetch first user & assistant messages
    const messages = await ctx.runQuery(api.messages.getMessages, {
      threadId,
      limit: 2,
    });

    if (messages.length === 0) {
      throw new Error("No messages found to generate title");
    }

    const userFirst = messages[0]?.messageChunks.map((chunk) => chunk.content).join("") ?? "";
    const assistantFirst = messages[1]?.messageChunks.map((chunk) => chunk.content).join("") ?? "";
    const systemPrompt = "You are an assistant that returns ONLY a concise title. • Max 6 words. • Max 30 characters. • Avoid quotation marks or punctuation at the end. • Reply with the title text ONLY.";

    const requestMessages: CoreMessage[] = [
      { role: "user", content: userFirst },
    ];
    if (assistantFirst.trim().length > 0) {
      requestMessages.push({ role: "assistant", content: assistantFirst });
    }

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

    const { text: rawTitle } = await streamText({
      model: openrouter(FREE_MODELS[0]),
      system: systemPrompt,
      messages: requestMessages,
    });

    const sanitizeTitle = (raw: string): string => {
      const compressed = raw.replace(/\s+/g, " ").trim();
      let words = compressed.split(" ").slice(0, 6).join(" ");
      return words.length ? words : "Untitled Thread";
    };
    const title = sanitizeTitle(await rawTitle);

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
    userId: v.string(),
  },
  returns: v.id("threads"),
  handler: async (ctx, args) => {
    const defaultTitle = "New Thread";

    const threadId = await ctx.db.insert("threads", {
      created_at: Date.now(),
      updated_at: Date.now(),
      error: args.error ?? null,
      title: defaultTitle,
      user_id: args.userId,
    });
    return threadId;
  },
});