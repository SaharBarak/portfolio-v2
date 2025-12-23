import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all comments for a blog post
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    // Sort by creation date (newest first for top-level, oldest first for replies)
    return comments.sort((a, b) => {
      // Top-level comments first, sorted newest to oldest
      if (!a.parentId && !b.parentId) {
        return b.createdAt - a.createdAt;
      }
      // Replies sorted oldest to newest
      if (a.parentId && b.parentId) {
        return a.createdAt - b.createdAt;
      }
      // Top-level before replies
      return a.parentId ? 1 : -1;
    });
  },
});

// Get comment count for a blog post
export const getCount = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    return comments.length;
  },
});

// Add a new comment
export const add = mutation({
  args: {
    slug: v.string(),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    content: v.string(),
    parentId: v.optional(v.id("blogComments")),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("blogComments", {
      slug: args.slug,
      userId: args.userId,
      userName: args.userName,
      userImage: args.userImage,
      content: args.content,
      createdAt: Date.now(),
      parentId: args.parentId,
      likes: 0,
    });

    return commentId;
  },
});

// Update a comment
export const update = mutation({
  args: {
    commentId: v.id("blogComments"),
    userId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== args.userId) {
      throw new Error("Not authorized to edit this comment");
    }

    await ctx.db.patch(args.commentId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

// Delete a comment
export const remove = mutation({
  args: {
    commentId: v.id("blogComments"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== args.userId) {
      throw new Error("Not authorized to delete this comment");
    }

    // Delete all replies first
    const replies = await ctx.db
      .query("blogComments")
      .withIndex("by_parent", (q) => q.eq("parentId", args.commentId))
      .collect();

    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }

    await ctx.db.delete(args.commentId);
  },
});

// Like a comment
export const like = mutation({
  args: {
    commentId: v.id("blogComments"),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    await ctx.db.patch(args.commentId, {
      likes: (comment.likes || 0) + 1,
    });
  },
});
