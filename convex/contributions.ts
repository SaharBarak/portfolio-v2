import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("repo"), v.literal("npm"))),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db
      .query("contributions")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    if (args.type) {
      items = items.filter((item) => item.type === args.type);
    }

    return items.sort((a, b) => a.order - b.order);
  },
});

export const getById = query({
  args: { id: v.id("contributions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("repo"), v.literal("npm")),
    url: v.string(),
    stars: v.optional(v.number()),
    prs: v.optional(v.number()),
    language: v.optional(v.string()),
    downloads: v.optional(v.string()),
    version: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contributions")
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
      return await ctx.db.insert("contributions", data);
    }
  },
});

export const remove = mutation({
  args: { notionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contributions")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
