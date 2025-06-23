import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const createMessage = mutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    threadId: v.id("threads"),
    isComplete: v.boolean(),
    userId: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newMessageId = await ctx.db.insert("messages", {
      thread_id: args.threadId as Id<"threads">,
      role: args.role,
      isComplete: args.isComplete,
      error: null,
      user_id: args.userId || "",
      created_at: Date.now(),
      updated_at: Date.now()
    });

    if (args.content) {
      await ctx.db.insert("messageChunks", {
        message_id: newMessageId as Id<"messages">,
        content: args.content,
      });
    }

    return newMessageId;
  },
});

export const createMessageChunk = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messageChunks", {
      message_id: args.messageId as Id<"messages">,
      content: args.content,
    });
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    isComplete: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      isComplete: args.isComplete,
    });
  },
});

export const getMessages = query({
  args: {
    threadId: v.id("threads"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the most recent messages first, limited if specified
    const query = ctx.db
      .query("messages")
      .withIndex("by_thread_id", (q) =>
        q.eq("thread_id", args.threadId)
      )
      .order("desc");

    const messages = await (args.limit ? query.take(args.limit) : query.collect());
    messages.reverse(); // Put them back in chronological order

    // Fetch chunks for each message
    const messagesWithChunks = await Promise.all(
      messages.map(async (message) => {
        const chunks = await ctx.db
          .query("messageChunks")
          .withIndex("by_message_id", (q) =>
            q.eq("message_id", message._id)
          )
          .order("asc")
          .collect();

        return {
          ...message,
          messageChunks: chunks
        };
      })
    );

    return messagesWithChunks;
  },
});