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
    // Engagement stats
    views: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_date", ["date"])
    .index("by_notion_id", ["notionId"])
    .index("by_published", ["published"]),

  // Blog Reactions (anonymous emoji reactions)
  blogReactions: defineTable({
    slug: v.string(),
    fire: v.number(),
    heart: v.number(),
    rocket: v.number(),
    mindBlown: v.number(),
    lightbulb: v.number(),
  }).index("by_slug", ["slug"]),

  // Newsletter Subscribers
  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Blog Comments
  blogComments: defineTable({
    slug: v.string(),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    parentId: v.optional(v.id("blogComments")),
    likes: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentId"]),

  // Blog Likes (user-attributed)
  blogLikes: defineTable({
    slug: v.string(),
    userId: v.string(),
    userName: v.string(),
    userImage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_user", ["userId"])
    .index("by_slug_user", ["slug", "userId"]),

  // Blog Claps (Medium-style, anonymous with visitor ID)
  blogClaps: defineTable({
    slug: v.string(),
    visitorId: v.string(),
    count: v.number(), // 1-50 claps per visitor
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_visitor", ["visitorId"])
    .index("by_slug_visitor", ["slug", "visitorId"]),

  // Blog Series (group related articles)
  blogSeries: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
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

  // About page content
  about: defineTable({
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
    syncedAt: v.number(),
  }).index("by_notion_id", ["notionId"]),
});
