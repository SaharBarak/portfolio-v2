import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    section: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("now")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    if (args.section) {
      items = items.filter((item) => item.section === args.section);
    }

    return items.sort((a, b) => a.order - b.order);
  },
});

export const bySection = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("now")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Group by section
    const grouped: Record<string, typeof items> = {};
    for (const item of items.sort((a, b) => a.order - b.order)) {
      if (!grouped[item.section]) {
        grouped[item.section] = [];
      }
      grouped[item.section].push(item);
    }

    return grouped;
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    section: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    emoji: v.optional(v.string()),
    url: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("now")
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
      return await ctx.db.insert("now", data);
    }
  },
});

export const remove = mutation({
  args: { notionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("now")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
