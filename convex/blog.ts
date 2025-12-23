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
      views: post.views || 0,
    }));
  },
});

// Increment view count
export const incrementViews = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blog")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (post) {
      await ctx.db.patch(post._id, {
        views: (post.views || 0) + 1,
      });
    }
  },
});

// Get reactions for a post
export const getReactions = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("blogReactions")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return reactions || {
      fire: 0,
      heart: 0,
      rocket: 0,
      mindBlown: 0,
      lightbulb: 0,
    };
  },
});

// Add reaction to a post
export const addReaction = mutation({
  args: {
    slug: v.string(),
    reaction: v.union(
      v.literal("fire"),
      v.literal("heart"),
      v.literal("rocket"),
      v.literal("mindBlown"),
      v.literal("lightbulb")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blogReactions")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        [args.reaction]: (existing[args.reaction] || 0) + 1,
      });
    } else {
      await ctx.db.insert("blogReactions", {
        slug: args.slug,
        fire: args.reaction === "fire" ? 1 : 0,
        heart: args.reaction === "heart" ? 1 : 0,
        rocket: args.reaction === "rocket" ? 1 : 0,
        mindBlown: args.reaction === "mindBlown" ? 1 : 0,
        lightbulb: args.reaction === "lightbulb" ? 1 : 0,
      });
    }
  },
});

// Subscribe to newsletter
export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { success: true, message: "Already subscribed" };
    }

    await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
      source: args.source || "blog",
    });

    return { success: true, message: "Subscribed successfully" };
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

// Get subscriber count for social proof
export const getSubscriberCount = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db.query("subscribers").collect();
    return subscribers.length;
  },
});

// Get popular posts (sorted by views)
export const listPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("blog")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    // Sort by views descending
    const sorted = posts.sort((a, b) => (b.views || 0) - (a.views || 0));

    // Limit
    const limited = args.limit ? sorted.slice(0, args.limit) : sorted.slice(0, 5);

    return limited.map((post, index) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      tags: post.tags,
      excerpt: post.excerpt,
      views: post.views || 0,
      rank: index + 1,
    }));
  },
});

// Get posts by multiple slugs (for reading list)
export const getBySlugList = query({
  args: { slugs: v.array(v.string()) },
  handler: async (ctx, args) => {
    const posts = await Promise.all(
      args.slugs.map((slug) =>
        ctx.db
          .query("blog")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first()
      )
    );

    return posts.filter(Boolean).map((post) => ({
      _id: post!._id,
      title: post!.title,
      slug: post!.slug,
      date: post!.date,
      tags: post!.tags,
      excerpt: post!.excerpt,
      coverImage: post!.coverImage,
    }));
  },
});

// Get author stats
export const getAuthorStats = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blog")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalWords = posts.reduce(
      (sum, p) => sum + (p.content?.split(/\s+/).length || 0),
      0
    );

    // Get total claps
    const claps = await ctx.db.query("blogClaps").collect();
    const totalClaps = claps.reduce((sum, c) => sum + c.count, 0);

    return {
      totalPosts: posts.length,
      totalViews,
      totalClaps,
      totalWords,
    };
  },
});
