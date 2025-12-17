import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("research")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect()
      .then((items) => items.sort((a, b) => a.order - b.order));
  },
});

export const getById = query({
  args: { id: v.id("research") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("research"),
      v.literal("active"),
      v.literal("concept")
    ),
    field: v.string(),
    links: v.array(
      v.object({
        label: v.string(),
        url: v.string(),
      })
    ),
    references: v.array(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("research")
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
      return await ctx.db.insert("research", data);
    }
  },
});

export const remove = mutation({
  args: { notionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("research")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
