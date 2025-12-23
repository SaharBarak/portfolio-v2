import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get likes for a blog post
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("blogLikes")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    return {
      count: likes.length,
      users: likes.slice(0, 10).map((like) => ({
        userId: like.userId,
        userName: like.userName,
        userImage: like.userImage,
      })),
    };
  },
});

// Check if user has liked a post
export const hasLiked = query({
  args: { slug: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("blogLikes")
      .withIndex("by_slug_user", (q) =>
        q.eq("slug", args.slug).eq("userId", args.userId)
      )
      .first();

    return !!like;
  },
});

// Toggle like on a post
export const toggle = mutation({
  args: {
    slug: v.string(),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("blogLikes")
      .withIndex("by_slug_user", (q) =>
        q.eq("slug", args.slug).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      // Unlike
      await ctx.db.delete(existing._id);
      return { liked: false };
    } else {
      // Like
      await ctx.db.insert("blogLikes", {
        slug: args.slug,
        userId: args.userId,
        userName: args.userName,
        userImage: args.userImage,
        createdAt: Date.now(),
      });
      return { liked: true };
    }
  },
});

// Get like count only (lighter query)
export const getCount = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("blogLikes")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    return likes.length;
  },
});
