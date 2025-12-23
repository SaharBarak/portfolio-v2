import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // Get the first (and should be only) availability record
    const availability = await ctx.db.query("availability").first();
    return availability;
  },
});

export const set = mutation({
  args: {
    isAvailable: v.boolean(),
    status: v.union(
      v.literal("Available"),
      v.literal("Limited"),
      v.literal("Booked")
    ),
    message: v.optional(v.string()),
    calendlyUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Get existing record
    const existing = await ctx.db.query("availability").first();

    const data = {
      ...args,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("availability", data);
    }
  },
});

// Upsert for sync from Notion
export const upsert = mutation({
  args: {
    notionId: v.string(),
    isAvailable: v.boolean(),
    status: v.union(
      v.literal("Available"),
      v.literal("Limited"),
      v.literal("Booked")
    ),
    message: v.optional(v.string()),
    calendlyUrl: v.optional(v.string()),
    syncedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get existing record (only one availability record)
    const existing = await ctx.db.query("availability").first();

    const data = {
      isAvailable: args.isAvailable,
      status: args.status,
      message: args.message,
      calendlyUrl: args.calendlyUrl || "",
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      return await ctx.db.insert("availability", data);
    }
  },
});

export const toggle = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("availability").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isAvailable: !existing.isAvailable,
        status: existing.isAvailable ? "Booked" : "Available",
        updatedAt: Date.now(),
      });
    }
  },
});
