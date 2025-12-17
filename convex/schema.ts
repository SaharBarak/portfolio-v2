import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Projects (Featured Work)
  projects: defineTable({
    notionId: v.string(),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
    url: v.string(),
    logo: v.optional(v.string()),
    colors: v.object({
      bg: v.string(),
      accent: v.string(),
      text: v.string(),
      textMuted: v.optional(v.string()),
    }),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Freelance (Client Work)
  freelance: defineTable({
    notionId: v.string(),
    title: v.string(),
    client: v.optional(v.string()),
    description: v.string(),
    url: v.string(),
    logo: v.optional(v.string()),
    colors: v.object({
      bg: v.string(),
      accent: v.string(),
      text: v.string(),
      textMuted: v.optional(v.string()),
    }),
    testimonial: v.optional(v.string()),
    tags: v.array(v.string()),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Research
  research: defineTable({
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
    syncedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Contributions (GitHub repos + npm packages)
  contributions: defineTable({
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
    syncedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_type", ["type"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Blog
  blog: defineTable({
    notionId: v.string(),
    title: v.string(),
    slug: v.string(),
    date: v.string(),
    tags: v.array(v.string()),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    syncedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_date", ["date"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Ideas
  ideas: defineTable({
    notionId: v.string(),
    title: v.string(),
    status: v.string(),
    tags: v.array(v.string()),
    description: v.string(),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Now (current activities)
  now: defineTable({
    notionId: v.string(),
    section: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    emoji: v.optional(v.string()),
    url: v.optional(v.string()),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  })
    .index("by_section", ["section"])
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Links (centralized URLs)
  links: defineTable({
    notionId: v.string(),
    category: v.string(),
    name: v.string(),
    url: v.string(),
    label: v.optional(v.string()),
    syncedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_name", ["name"])
    .index("by_notion_id", ["notionId"]),

  // Availability
  availability: defineTable({
    isAvailable: v.boolean(),
    status: v.union(
      v.literal("Available"),
      v.literal("Limited"),
      v.literal("Booked")
    ),
    message: v.optional(v.string()),
    calendlyUrl: v.string(),
    updatedAt: v.number(),
  }),
});
