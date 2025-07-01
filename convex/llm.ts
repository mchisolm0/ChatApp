import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { CoreMessage } from "ai";
import { api } from "./_generated/api";
import { FREE_MODELS } from "@/services/models";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Minimum chunk size to reduce database writes
const MIN_CHUNK_SIZE = 20;
const FLUSH_INTERVAL = 200; // ms

export const generateAssistantMessage = internalAction({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    content: v.string(),
    model: v.string(),
    assistantMessageId: v.id("messages"),
  },

  handler: async (ctx, args) => {
    try {
      const messages = await ctx.runQuery(api.messages.getMessages, {
        threadId: args.threadId,
      });

      const fullPrompt = [
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content
        })),
        { role: "user", content: args.content },
      ];

      const result = streamText({
        model: openrouter(args.model),
        system: `You are a helpful assistant that provides clear, concise responses. Be direct and to the point, using as few words as possible while still being helpful and conversational. Avoid unnecessary explanations unless specifically asked.`,
        messages: fullPrompt as CoreMessage[],
      });

      let buffer = "";
      let lastFlushTime = Date.now();
      let flushTimeout: NodeJS.Timeout | null = null;

      const flush = async (force = false, retryCount = 0) => {
        if (!force && (buffer.length < MIN_CHUNK_SIZE || Date.now() - lastFlushTime < FLUSH_INTERVAL)) {
          return;
        }

        if (buffer.length === 0) return;

        const contentToFlush = buffer;
        buffer = "";
        flushTimeout = null;
        lastFlushTime = Date.now();

        try {
          await ctx.runMutation(api.messages.createMessageChunk, {
            messageId: args.assistantMessageId,
            content: contentToFlush,
          });
        } catch (error) {
          console.error("Failed to save message chunk:", error);
          if(retryCount < 10){
            console.error("Max retries reached, discarding message chunk" + contentToFlush);
            throw error;
          }
          // In case of error, add content back to buffer
          buffer = contentToFlush + buffer;
          // Retry after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          await flush(true, retryCount + 1);
        }
      };

      for await (const chunk of result.textStream) {
        if (chunk) {
          buffer += chunk;

          // Schedule a flush if not already scheduled
          if (!flushTimeout) {
            flushTimeout = setTimeout(() => flush(), FLUSH_INTERVAL);
          }

          // Force flush if buffer gets too large
          if (buffer.length >= MIN_CHUNK_SIZE * 2) {
            if (flushTimeout) {
              clearTimeout(flushTimeout);
              flushTimeout = null;
            }
            await flush(true);
          }
        }
      }

      // Final cleanup
      if (flushTimeout) {
        clearTimeout(flushTimeout);
      }
      // Force flush any remaining content
      await flush(true);

      // Mark message as complete
      await ctx.runMutation(api.messages.updateMessage, {
        messageId: args.assistantMessageId,
        isComplete: true,
      });

      // Generate a concise thread title only if this is the first assistant message
      if (messages.length === 2) {
        await ctx.scheduler.runAfter(0, api.chat.generateThreadTitle, {
          threadId: args.threadId,
        });
      }

    } catch (error) {
      console.error("Error in generateAssistantMessage:", error);

      // Mark message as complete but with error state
      await ctx.runMutation(api.messages.updateMessage, {
        messageId: args.assistantMessageId,
        isComplete: true,
      });

      // Add error message as final chunk
      await ctx.runMutation(api.messages.createMessageChunk, {
        messageId: args.assistantMessageId,
        content: "\n\nI apologize, but I encountered an error while generating the response. Please try again.",
      });

      throw error; // Re-throw to trigger Convex's error handling
    }
  },
});