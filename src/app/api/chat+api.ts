import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from "zod";

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid JSON", { status: 400 })
  }

  const schema = z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string().max(4_000),
        }),
      )
      .min(1)
      .max(50),
  })

  const parse = schema.safeParse(body)
  if (!parse.success) {
    return new Response("Malformed payload", { status: 422 })
  }

  const { messages } = parse.data

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
  });

  return result.toDataStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}