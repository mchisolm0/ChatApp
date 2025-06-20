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