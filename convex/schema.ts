import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    isComplete: v.boolean(),
    error: v.union(v.null(), v.string()),
    user_id: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    thread_id: v.id("threads"),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_thread_id", ["thread_id"]),
  messageChunks: defineTable({
    content: v.string(),
    message_id: v.id("messages"),
  }).index("by_message_id", ["message_id"]),
  threads: defineTable({
    error: v.union(v.null(), v.string()),
    title: v.string(),
    user_id: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  }).index("by_user_id", ["user_id"]),
  users: defineTable({
    avatar_url: v.string(),
    email: v.string(),
    role: v.union(v.literal("free"), v.literal("paid"), v.literal("admin")),
    full_name: v.string(),
    user_id: v.string(),
  }),
});