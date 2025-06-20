import { query } from "./_generated/server";
import { v } from "convex/values";

export const listThreadsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_user_id", q => q.eq("user_id", args.userId))
      .collect();
  },
});

export const searchThreadsByTitle = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    // Ensure user is logged in
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    const userId = identity.subject ?? identity.tokenIdentifier;

    const lower = searchQuery.toLowerCase();

    // Fetch all threads for this user using the existing index
    const threads = await ctx.db
      .query("threads")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .collect();

    // Perform a simple case-insensitive substring match on the title
    return threads.filter((t) => (t.title ?? "").toLowerCase().includes(lower));
  },
});