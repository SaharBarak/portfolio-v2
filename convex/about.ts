import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get the first (and should be only) about record
    const about = await ctx.db.query("about").first();
    return about;
  },
});

export const upsert = mutation({
  args: {
    notionId: v.string(),
    heroImages: v.array(v.string()),
    headline: v.string(),
    tagline: v.string(),
    bio: v.string(),
    bioSecondary: v.optional(v.string()),
    ventures: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        url: v.string(),
      })
    ),
    freelance: v.object({
      name: v.string(),
      description: v.string(),
      url: v.string(),
    }),
    research: v.string(),
    stack: v.array(
      v.object({
        label: v.string(),
        items: v.array(v.string()),
      })
    ),
    hobbies: v.string(),
    socialLinks: v.object({
      email: v.string(),
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      twitter: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("about")
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
      return await ctx.db.insert("about", data);
    }
  },
});
