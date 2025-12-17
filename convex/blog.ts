import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("blog")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Sort by date descending
    posts = posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Filter by tag if provided
    if (args.tag) {
      posts = posts.filter((p) => p.tags.includes(args.tag!));
    }

    // Limit if provided
    if (args.limit) {
      posts = posts.slice(0, args.limit);
    }

    // Return without full content for list view
    return posts.map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      tags: post.tags,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blog")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blog")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    const tags = new Set(posts.flatMap((p) => p.tags));
    return Array.from(tags).sort();
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    title: v.string(),
    slug: v.string(),
    date: v.string(),
    tags: v.array(v.string()),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blog")
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
      return await ctx.db.insert("blog", data);
    }
  },
});

export const remove = mutation({
  args: { notionId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blog")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
