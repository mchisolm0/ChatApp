import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messeges: defineTable({
    content: v.string(),
    error: v.union(v.null(), v.string()),
    id: v.string(),
    role: v.string(),
    thread_id: v.string(),
  }),
  threads: defineTable({
    error: v.union(v.null(), v.string()),
    id: v.string(),
    title: v.string(),
    user_id: v.string(),
  }),
  users: defineTable({
    avatar_url: v.string(),
    email: v.string(),
    full_name: v.string(),
    id: v.string(),
  }),
});