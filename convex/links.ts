import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("links")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("links").collect();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("links")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

export const byCategory = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("links").collect();

    // Group by category
    const grouped: Record<string, typeof links> = {};
    for (const link of links) {
      if (!grouped[link.category]) {
        grouped[link.category] = [];
      }
      grouped[link.category].push(link);
    }

    return grouped;
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    category: v.string(),
    name: v.string(),
    url: v.string(),
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("links")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    const data = {
      ...args,
      syncedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("links", data);
    }
  },
});

export const remove = mutation({
  args: { notionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("links")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
