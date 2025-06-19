import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from "zod";

// Define the free models that can be picked by the client UI
export const FREE_MODELS = [
  'google/gemma-3-4b-it:free',
  'google/gemma-3-12b-it:free',
  'rekaai/reka-flash-3:free',
  'microsoft/phi-4-reasoning-plus-04-30:free',
  'google/gemini-2.5-pro-exp-03-25',
  'google/gemma-3-27b-it',
  'deepseek/deepseek-r1-0528:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemini-2.0-flash-001',
] as const;

// Zod schema that coerces / clamps an arbitrary string to a valid model name.
// If the supplied name is not in the FREE_MODELS list we silently fallback
// to the first (default) option instead of throwing an error.
const ModelNameSchema = z
  .string()
  .transform((name) => (FREE_MODELS.includes(name as any) ? name : FREE_MODELS[0]));

// Request payload schema – aligns with `@vercel/ai` & `useChat` expectations
//   { messages: ChatMessage[]; modelName?: string }
const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system', 'function']).optional(),
      content: z.string(),
    })
  ),
  modelName: ModelNameSchema.default(FREE_MODELS[0]),
});

// Helper: stream model answer from OpenRouter. Kept generic so can be reused.
export const askModelStream = (modelName: string, messages: { role?: string; content: string }[]) => {
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return streamText({
    model: openrouter(modelName),
    messages: messages as any,
  });
};

export async function POST(req: Request) {
  const body = await req.json();
  // Validate & coerce request according to our schema
  const { messages, modelName } = ChatRequestSchema.parse(body);

  const result = askModelStream(modelName, messages);

  // Return as an octet-stream, same headers the Vercel AI SDK example uses
  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}