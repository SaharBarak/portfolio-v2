import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get total claps for a blog post
export const getClaps = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const claps = await ctx.db
      .query("blogClaps")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    const totalClaps = claps.reduce((sum, c) => sum + c.count, 0);
    const uniqueVoters = claps.length;

    return { totalClaps, uniqueVoters };
  },
});

// Get a specific visitor's clap count for a post
export const getVisitorClaps = query({
  args: { slug: v.string(), visitorId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blogClaps")
      .withIndex("by_slug_visitor", (q) =>
        q.eq("slug", args.slug).eq("visitorId", args.visitorId)
      )
      .first();

    return existing?.count ?? 0;
  },
});

// Add claps (increment, max 50 per visitor)
export const addClap = mutation({
  args: {
    slug: v.string(),
    visitorId: v.string(),
    increment: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const increment = args.increment ?? 1;
    const now = Date.now();

    const existing = await ctx.db
      .query("blogClaps")
      .withIndex("by_slug_visitor", (q) =>
        q.eq("slug", args.slug).eq("visitorId", args.visitorId)
      )
      .first();

    if (existing) {
      // Check if at max
      if (existing.count >= 50) {
        return { success: false, count: existing.count, maxReached: true };
      }

      // Increment up to max of 50
      const newCount = Math.min(existing.count + increment, 50);
      await ctx.db.patch(existing._id, {
        count: newCount,
        updatedAt: now,
      });

      return { success: true, count: newCount, maxReached: newCount >= 50 };
    } else {
      // Create new entry
      const newCount = Math.min(increment, 50);
      await ctx.db.insert("blogClaps", {
        slug: args.slug,
        visitorId: args.visitorId,
        count: newCount,
        createdAt: now,
        updatedAt: now,
      });

      return { success: true, count: newCount, maxReached: newCount >= 50 };
    }
  },
});

// Reset visitor's claps (optional utility)
export const resetVisitorClaps = mutation({
  args: { slug: v.string(), visitorId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blogClaps")
      .withIndex("by_slug_visitor", (q) =>
        q.eq("slug", args.slug).eq("visitorId", args.visitorId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    return { success: true };
  },
});
