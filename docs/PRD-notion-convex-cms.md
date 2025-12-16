# PRD: Notion + Convex CMS Integration

**Version:** 1.0
**Author:** Sahar Barak
**Date:** December 2024
**Branch:** `feature/notion-convex-cms`

---

## 1. Overview

### 1.1 Problem Statement

All portfolio content is currently hardcoded across 10+ component files, requiring code changes and deployments for any content update. This creates friction for:
- Adding new projects, blog posts, or freelance work
- Updating availability status
- Making quick content edits
- Managing content from mobile or non-dev environments

### 1.2 Solution

Implement a hybrid CMS architecture using:
- **Notion** as the content authoring interface (familiar UI, mobile-friendly)
- **Convex** as the real-time database layer (fast queries, no rebuild needed)
- **Sync pipeline** to bridge Notion → Convex automatically

### 1.3 Goals

1. Zero-rebuild content updates
2. Familiar editing experience (Notion)
3. Real-time content delivery
4. Type-safe content schemas
5. Support for 9 content types + new blog section

---

## 2. Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐      ┌──────────────┐      ┌──────────────┐     │
│   │  Notion  │ ───► │  Sync Script │ ───► │    Convex    │     │
│   │ (Author) │      │  (npm sync)  │      │  (Database)  │     │
│   └──────────┘      └──────────────┘      └──────────────┘     │
│        │                                         │              │
│        │ Webhook (optional)                      │ Real-time    │
│        ▼                                         ▼              │
│   ┌──────────────────────────────────────────────────────┐     │
│   │                   Next.js App                         │     │
│   │  ┌─────────────────────────────────────────────────┐ │     │
│   │  │  useQuery(api.projects.list)                    │ │     │
│   │  │  useQuery(api.blog.getBySlug, { slug })         │ │     │
│   │  │  useQuery(api.availability.get)                 │ │     │
│   │  └─────────────────────────────────────────────────┘ │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Content Authoring | Notion API | Visual editing, mobile access |
| Database | Convex | Real-time queries, TypeScript schemas |
| Frontend | Next.js 15 | App Router, Server Components |
| Sync | Node.js script | Notion → Convex data pipeline |
| Webhooks | Notion + Vercel/Netlify | Auto-sync on content change |

---

## 3. Content Schema

### 3.1 Notion Databases

#### 3.1.1 Projects Database
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Project name |
| Subtitle | Text | Short tagline |
| Description | Text | Full description |
| URL | URL | Live project link |
| Logo | Files | Project logo/icon |
| BgColor | Text | Background color hex |
| AccentColor | Text | Accent color hex |
| TextColor | Text | Text color hex |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.2 Freelance Database
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Project name |
| Client | Text | Client name (optional for NDA) |
| Description | Text | Project description |
| URL | URL | Live project link |
| Logo | Files | Client/project logo |
| BgColor | Text | Background color hex |
| AccentColor | Text | Accent color hex |
| TextColor | Text | Text color hex |
| Testimonial | Text | Client testimonial |
| Tags | Multi-select | Technologies used |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.3 Research Database
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Research title |
| Description | Text | Research summary |
| Status | Select | research / active / concept |
| Field | Select | ML, Blockchain, Cryptography, Identity, LLM, Clean Energy |
| Links | Text (JSON) | Array of { label, url } |
| References | Text (JSON) | Array of reference strings |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.4 Contributions Database
| Field | Type | Description |
|-------|------|-------------|
| Name | Title | Repo/package name |
| Description | Text | Short description |
| Type | Select | repo / npm |
| URL | URL | GitHub or npm link |
| Stars | Number | GitHub stars |
| PRs | Number | Number of PRs |
| Language | Select | TypeScript, Python, Rust, Go |
| Downloads | Text | Weekly downloads (for npm) |
| Version | Text | Current version (for npm) |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.5 Blog Database
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Post title |
| Slug | Text | URL slug (unique) |
| Date | Date | Publish date |
| Tags | Multi-select | Post categories |
| Excerpt | Text | Short preview text |
| Content | Text (Rich) | Full post content (Notion blocks) |
| CoverImage | Files | Featured image |
| Published | Checkbox | Show on site |

#### 3.1.6 Ideas Database
| Field | Type | Description |
|-------|------|-------------|
| Title | Title | Idea name |
| Status | Select | Concept / Prototype / Active / Exploring / Vision |
| Tags | Multi-select | Categories |
| Description | Text | Idea description |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.7 Now Database
| Field | Type | Description |
|-------|------|-------------|
| Section | Select | Products / Reading / Listening / Life |
| Title | Title | Item title |
| Description | Text | Item description |
| Emoji | Text | Display emoji |
| URL | URL | Optional link |
| Order | Number | Display order |
| Published | Checkbox | Show on site |

#### 3.1.8 Links Database
| Field | Type | Description |
|-------|------|-------------|
| Category | Select | social / projects / professional / support / external |
| Name | Title | Link name/key |
| URL | URL | Full URL |
| Label | Text | Display label |

#### 3.1.9 Availability Database
| Field | Type | Description |
|-------|------|-------------|
| IsAvailable | Checkbox | Currently available for work |
| Status | Select | Available / Limited / Booked |
| Message | Text | Custom message (optional) |
| CalendlyURL | URL | Booking link |
| UpdatedAt | Date | Last updated |

---

## 4. Convex Schema

### 4.1 Schema Definitions

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
  }).index("by_order", ["order"])
    .index("by_notion_id", ["notionId"]),

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
    }),
    testimonial: v.optional(v.string()),
    tags: v.array(v.string()),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  }).index("by_order", ["order"])
    .index("by_notion_id", ["notionId"]),

  research: defineTable({
    notionId: v.string(),
    title: v.string(),
    description: v.string(),
    status: v.union(v.literal("research"), v.literal("active"), v.literal("concept")),
    field: v.string(),
    links: v.array(v.object({
      label: v.string(),
      url: v.string(),
    })),
    references: v.array(v.string()),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  }).index("by_order", ["order"])
    .index("by_notion_id", ["notionId"]),

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
  }).index("by_order", ["order"])
    .index("by_type", ["type"])
    .index("by_notion_id", ["notionId"]),

  blog: defineTable({
    notionId: v.string(),
    title: v.string(),
    slug: v.string(),
    date: v.string(),
    tags: v.array(v.string()),
    excerpt: v.string(),
    content: v.string(), // Markdown or HTML
    coverImage: v.optional(v.string()),
    published: v.boolean(),
    syncedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_date", ["date"])
    .index("by_notion_id", ["notionId"]),

  ideas: defineTable({
    notionId: v.string(),
    title: v.string(),
    status: v.string(),
    tags: v.array(v.string()),
    description: v.string(),
    order: v.number(),
    published: v.boolean(),
    syncedAt: v.number(),
  }).index("by_order", ["order"])
    .index("by_notion_id", ["notionId"]),

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
  }).index("by_section", ["section"])
    .index("by_order", ["order"])
    .index("by_notion_id", ["notionId"]),

  links: defineTable({
    notionId: v.string(),
    category: v.string(),
    name: v.string(),
    url: v.string(),
    label: v.optional(v.string()),
    syncedAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_notion_id", ["notionId"]),

  availability: defineTable({
    isAvailable: v.boolean(),
    status: v.union(v.literal("Available"), v.literal("Limited"), v.literal("Booked")),
    message: v.optional(v.string()),
    calendlyUrl: v.string(),
    updatedAt: v.number(),
  }),
});
```

---

## 5. Sync Pipeline

### 5.1 Sync Script Structure

```
scripts/
├── sync.ts              # Main sync orchestrator
├── notion-client.ts     # Notion API wrapper
├── transformers/        # Notion → Convex data transformers
│   ├── projects.ts
│   ├── freelance.ts
│   ├── research.ts
│   ├── contributions.ts
│   ├── blog.ts
│   ├── ideas.ts
│   ├── now.ts
│   ├── links.ts
│   └── availability.ts
└── utils/
    └── notion-blocks.ts  # Convert Notion blocks to markdown
```

### 5.2 Sync Commands

```bash
# Development sync (uses CONVEX_URL from .env.local)
npm run sync

# Production sync (uses production Convex deployment)
npm run sync:prod

# Sync specific content type
npm run sync -- --only=blog
npm run sync -- --only=projects,freelance

# Full sync with verbose logging
npm run sync -- --verbose
```

### 5.3 Environment Variables

```env
# .env.local
NOTION_API_KEY=secret_xxx
NOTION_PROJECTS_DB=xxx
NOTION_FREELANCE_DB=xxx
NOTION_RESEARCH_DB=xxx
NOTION_CONTRIBUTIONS_DB=xxx
NOTION_BLOG_DB=xxx
NOTION_IDEAS_DB=xxx
NOTION_NOW_DB=xxx
NOTION_LINKS_DB=xxx
NOTION_AVAILABILITY_DB=xxx

CONVEX_URL=https://xxx.convex.cloud
```

---

## 6. Frontend Integration

### 6.1 Convex Provider Setup

```typescript
// src/app/providers.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
```

### 6.2 Query Hooks

```typescript
// src/hooks/useContent.ts
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useProjects() {
  return useQuery(api.projects.list);
}

export function useFreelance() {
  return useQuery(api.freelance.list);
}

export function useBlogPosts() {
  return useQuery(api.blog.list);
}

export function useBlogPost(slug: string) {
  return useQuery(api.blog.getBySlug, { slug });
}

export function useAvailability() {
  return useQuery(api.availability.get);
}
```

### 6.3 Server-Side Queries (SSR/SSG)

```typescript
// For static/server rendering
import { fetchQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";

export async function getProjects() {
  return await fetchQuery(api.projects.list);
}
```

---

## 7. New Components

### 7.1 Availability Badge

```typescript
// src/components/ui/AvailabilityBadge.tsx
"use client";
import { useAvailability } from "@/hooks/useContent";
import { LINKS } from "@/config/links";

export function AvailabilityBadge() {
  const availability = useAvailability();

  if (!availability) return null;

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  const statusColors = {
    Available: "bg-green-500",
    Limited: "bg-yellow-500",
    Booked: "bg-red-500",
  };

  return (
    <a
      href={availability.calendlyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className={`w-2 h-2 rounded-full animate-pulse ${statusColors[availability.status]}`} />
      <span className="text-sm">
        {availability.message || `${availability.status} ${currentMonth}`}
      </span>
    </a>
  );
}
```

### 7.2 Blog Components

#### Blog Routes:
```
/blog                    → Index (all posts, paginated)
/blog?tag=ai            → Filtered by tag
/blog/[slug]            → Individual post
```

#### Blog Index UI:
```
┌─────────────────────────────────────────────────────────────────┐
│  Blog                                                           │
│  Thoughts on AI, clean energy, and building products.           │
│                                                                 │
│  [All] [AI] [Tutorial] [Clean Energy] [Identity]  ← Tag filter │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📷  How I Built a Real-Time CMS                           │ │
│  │     December 16, 2024 · [Convex] [Next.js]                │ │
│  │     Building a CMS that updates without rebuilds...       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 📷  Detecting White Hydrogen with ML                      │ │
│  │     December 10, 2024 · [ML] [Clean Energy]               │ │
│  │     Using geospatial ML to find clean energy...           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Load More]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

#### Convex Query (Blog List):
```typescript
// convex/blog.ts
export const list = query({
  args: {
    tag: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db
      .query("blog")
      .withIndex("by_date")
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .take(args.limit ?? 10);

    if (args.tag) {
      posts = posts.filter((p) => p.tags.includes(args.tag));
    }

    // Return list data (no full content - saves bandwidth)
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
      .filter((q) => q.eq(q.field("published"), true))
      .first();
  },
});

export const getAllTags = query({
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blog")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();

    const tags = new Set(posts.flatMap((p) => p.tags));
    return Array.from(tags).sort();
  },
});
```

#### Blog Index Page:
```typescript
// src/app/blog/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { BlogCard } from "@/components/blog/BlogCard";
import { TagFilter } from "@/components/blog/TagFilter";

interface BlogPageProps {
  searchParams: { tag?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, allTags] = await Promise.all([
    fetchQuery(api.blog.list, { tag: searchParams.tag }),
    fetchQuery(api.blog.getAllTags),
  ]);

  return (
    <main className="container py-20">
      <h1 className="text-4xl font-bold mb-4">Blog</h1>
      <p className="text-muted mb-8">
        Thoughts on AI, clean energy, and building products.
      </p>

      <TagFilter tags={allTags} activeTag={searchParams.tag} />

      <div className="grid gap-6 mt-8">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-muted">No posts found.</p>
      )}
    </main>
  );
}
```

#### Blog Post Page:
```typescript
// src/app/blog/[slug]/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await fetchQuery(api.blog.getBySlug, { slug: params.slug });

  if (!post) notFound();

  return (
    <article className="container py-20 prose prose-lg">
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="rounded-xl" />
      )}
      <h1>{post.title}</h1>
      <div className="flex gap-2 text-sm text-muted">
        <time>{post.date}</time>
        {post.tags.map((tag) => (
          <span key={tag} className="bg-muted px-2 py-1 rounded">{tag}</span>
        ))}
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// Generate static paths for all published posts
export async function generateStaticParams() {
  const posts = await fetchQuery(api.blog.list, {});
  return posts.map((post) => ({ slug: post.slug }));
}
```

#### BlogCard Component:
```typescript
// src/components/blog/BlogCard.tsx
import Link from "next/link";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    excerpt: string;
    coverImage?: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group border rounded-xl p-6 hover:border-accent transition">
        <div className="flex gap-6">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt=""
              className="w-32 h-24 object-cover rounded-lg"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold group-hover:text-accent">
              {post.title}
            </h2>
            <div className="flex gap-2 text-sm text-muted mt-1">
              <time>{post.date}</time>
              {post.tags.map((tag) => (
                <span key={tag}>[{tag}]</span>
              ))}
            </div>
            <p className="text-muted mt-2 line-clamp-2">{post.excerpt}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

#### TagFilter Component:
```typescript
// src/components/blog/TagFilter.tsx
import Link from "next/link";

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Link
        href="/blog"
        className={`px-3 py-1 rounded-full ${
          !activeTag ? "bg-accent text-white" : "bg-muted"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog?tag=${tag}`}
          className={`px-3 py-1 rounded-full ${
            activeTag === tag ? "bg-accent text-white" : "bg-muted"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
```

### 7.3 Freelance Showcase Section

```typescript
// src/components/home/FreelanceShowcase.tsx
"use client";
import { useFreelance } from "@/hooks/useContent";

export function FreelanceShowcase() {
  const freelance = useFreelance();

  if (!freelance?.length) return null;

  return (
    <section className="py-20">
      <h2>Freelance Work</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {freelance.map((project) => (
          <FreelanceCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
}
```

---

## 8. Webhook Integration (Auto-Sync)

### 8.1 Notion Webhook Handler

```typescript
// src/app/api/webhook/notion/route.ts
import { NextRequest, NextResponse } from "next/server";
import { syncFromNotion } from "@/lib/sync";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-notion-signature");

  // Verify webhook signature
  if (secret !== process.env.NOTION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const databaseId = body.database_id;

  // Trigger sync for affected database
  await syncFromNotion(databaseId);

  return NextResponse.json({ success: true });
}
```

### 8.2 Alternative: Zapier/Make Integration

For simpler setup without custom webhook handling:

1. Create Zap: Notion → Webhook
2. Trigger: "Database Item Updated" or "New Database Item"
3. Action: POST to `/api/revalidate`
4. Body: `{ "database": "projects" }`

---

## 9. Existing Data Export

Before migrating to the new CMS, all hardcoded content must be exported and formatted for Notion import.

### 9.1 Data to Export

| Source File | Content Type | Items |
|-------------|--------------|-------|
| `src/components/home/FeaturedWork.tsx` | Projects | 4 |
| `src/components/home/ResearchContributions.tsx` | Research | 5 |
| `src/components/home/OpenSourceCode.tsx` | Contributions | 6 |
| `src/app/ideas/page.tsx` | Ideas | 5 |
| `src/app/now/page.tsx` | Now | ~10 |
| `src/app/about/page.tsx` | About (Skills, Interests) | 34 |
| `src/components/hero/HeroSection.tsx` | Roles | 5 |
| `src/components/layout/Header.tsx` | Header content | 1 |
| `src/components/layout/Footer.tsx` | Footer content | 1 |
| `src/config/links.ts` | Links | 30+ |

### 9.2 Export Script

```typescript
// scripts/export-to-notion.ts
import { Client } from "@notionhq/client";
import { existingProjects } from "./data/projects";
import { existingResearch } from "./data/research";
import { existingContributions } from "./data/contributions";
// ... etc

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function exportProjects() {
  for (const project of existingProjects) {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_PROJECTS_DB! },
      properties: {
        Title: { title: [{ text: { content: project.title } }] },
        Subtitle: { rich_text: [{ text: { content: project.subtitle } }] },
        Description: { rich_text: [{ text: { content: project.description } }] },
        URL: { url: project.link },
        BgColor: { rich_text: [{ text: { content: project.colors.bg } }] },
        AccentColor: { rich_text: [{ text: { content: project.colors.accent } }] },
        TextColor: { rich_text: [{ text: { content: project.colors.text } }] },
        Order: { number: project.order || 0 },
        Published: { checkbox: true },
      },
    });
  }
}

// Similar functions for each content type...
```

### 9.3 Extracted Data Files

```
scripts/
├── export-to-notion.ts      # Main export script
└── data/                    # Extracted hardcoded data
    ├── projects.ts          # From FeaturedWork.tsx
    ├── research.ts          # From ResearchContributions.tsx
    ├── contributions.ts     # From OpenSourceCode.tsx
    ├── ideas.ts             # From ideas/page.tsx
    ├── now.ts               # From now/page.tsx
    ├── links.ts             # From config/links.ts
    └── availability.ts      # Default availability config
```

### 9.4 Projects Data (from FeaturedWork.tsx)

```typescript
// scripts/data/projects.ts
export const existingProjects = [
  {
    title: "Wessley AI",
    subtitle: "Virtual Garage",
    description: "Platform for 3D car understanding and visualization",
    link: "https://wessley.ai",
    logo: "/logos/wessley.svg",
    colors: {
      bg: "#0a0a0a",
      accent: "#3b82f6",
      text: "#ffffff",
      textMuted: "#a1a1aa",
    },
    order: 1,
  },
  {
    title: "Karen CLI",
    subtitle: "Layout Regression Testing",
    description: "CLI tool for visual regression testing",
    link: "https://karencli.dev",
    logo: "/logos/karen.svg",
    colors: {
      bg: "#fef3c7",
      accent: "#f59e0b",
      text: "#1f2937",
      textMuted: "#6b7280",
    },
    order: 2,
  },
  {
    title: "The Peace Board",
    subtitle: "Decentralized Peace Pledges",
    description: "Interactive map for peace pledges worldwide",
    link: "https://thepeaceboard.com",
    logo: "/logos/peaceboard.svg",
    colors: {
      bg: "#ecfdf5",
      accent: "#10b981",
      text: "#1f2937",
      textMuted: "#6b7280",
    },
    order: 3,
  },
  {
    title: "Two Circle Studios",
    subtitle: "Product Studio",
    description: "Rapid prototyping and product development",
    link: "https://twocirclestudios.com",
    logo: "/logos/twocircle.svg",
    colors: {
      bg: "#1e1b4b",
      accent: "#8b5cf6",
      text: "#ffffff",
      textMuted: "#a1a1aa",
    },
    order: 4,
  },
];
```

### 9.5 Research Data (from ResearchContributions.tsx)

```typescript
// scripts/data/research.ts
export const existingResearch = [
  {
    title: "White Hydrogen Detection",
    description: "Geospatial ML pipeline for identifying natural hydrogen deposits",
    status: "research",
    field: "Clean Energy",
    links: [
      { label: "GitHub", url: "https://github.com/saharbarak/geoh2-ai" },
      { label: "LinkedIn", url: "https://linkedin.com/in/saharbarak" },
    ],
    references: ["Nature Energy 2023", "Geoscience Data Journal"],
    order: 1,
  },
  {
    title: "Gossip Verification Protocol",
    description: "Sybil-resistant reputation system using social graph analysis",
    status: "active",
    field: "Cryptography",
    links: [
      { label: "GitHub Spec", url: "https://github.com/saharbarak/gossip-protocol" },
      { label: "ArXiv", url: "https://arxiv.org/..." },
      { label: "Twitter Thread", url: "https://twitter.com/saharbarak/..." },
    ],
    references: [],
    order: 2,
  },
  {
    title: "Massive Context Tree Hashing",
    description: "Composable fingerprints for conversation histories",
    status: "concept",
    field: "LLM",
    links: [
      { label: "Dev.to", url: "https://dev.to/saharbarak/..." },
      { label: "GitHub RFC", url: "https://github.com/..." },
    ],
    references: [],
    order: 3,
  },
  {
    title: "Social Digital Signature (SDS)",
    description: "Graph-based identity authentication mechanism",
    status: "research",
    field: "Identity",
    links: [
      { label: "ArXiv", url: "https://arxiv.org/..." },
      { label: "HuggingFace", url: "https://huggingface.co/SaharBarak/..." },
      { label: "Demo", url: "https://..." },
    ],
    references: [],
    order: 4,
  },
  {
    title: "SEL-DID",
    description: "Self-Evident Layer Decentralized Identifier",
    status: "active",
    field: "Blockchain",
    links: [
      { label: "GitHub", url: "https://github.com/saharbarak/sel-did" },
      { label: "Whitepaper", url: "https://..." },
      { label: "Demo", url: "https://..." },
    ],
    references: [],
    order: 5,
  },
];
```

### 9.6 Contributions Data (from OpenSourceCode.tsx)

```typescript
// scripts/data/contributions.ts
export const existingContributions = [
  // GitHub Repos
  {
    name: "karen-cli",
    description: "Layout regression testing CLI",
    type: "repo",
    url: "https://github.com/saharbarak/karen-cli",
    stars: 42,
    prs: 8,
    language: "TypeScript",
    order: 1,
  },
  {
    name: "geoh2-ai",
    description: "Geospatial ML for hydrogen detection",
    type: "repo",
    url: "https://github.com/saharbarak/geoh2-ai",
    stars: 18,
    prs: 3,
    language: "Python",
    order: 2,
  },
  {
    name: "sel-did",
    description: "Decentralized identity layer",
    type: "repo",
    url: "https://github.com/saharbarak/sel-did",
    stars: 24,
    prs: 5,
    language: "Rust",
    order: 3,
  },
  {
    name: "gossip-protocol",
    description: "Sybil-resistant reputation verification",
    type: "repo",
    url: "https://github.com/saharbarak/gossip-protocol",
    stars: 31,
    prs: 12,
    language: "Go",
    order: 4,
  },
  // NPM Packages
  {
    name: "@anthropic-ai/claude-code",
    description: "Claude AI CLI tool",
    type: "npm",
    url: "https://www.npmjs.com/package/@anthropic-ai/claude-code",
    downloads: "50k+/week",
    version: "v1.0.0",
    order: 5,
  },
  {
    name: "karen-cli",
    description: "Layout testing CLI",
    type: "npm",
    url: "https://www.npmjs.com/package/karen-cli",
    downloads: "2.1k/week",
    version: "v0.4.2",
    order: 6,
  },
];
```

### 9.7 Ideas Data (from ideas/page.tsx)

```typescript
// scripts/data/ideas.ts
export const existingIdeas = [
  {
    title: "Taro",
    status: "Prototype",
    tags: ["Music", "Visualization"],
    description: "Real-time graph of chords and harmonies",
    order: 1,
  },
  {
    title: "Brief Me",
    status: "Concept",
    tags: ["AI", "Productivity"],
    description: "Personal sense-making layer for data-flooded digital life",
    order: 2,
  },
  {
    title: "SYNC",
    status: "Active",
    tags: ["Decentralization", "Identity"],
    description: "Web6 identity layer with SDS/SEL-DIDs",
    order: 3,
  },
  {
    title: "Been There",
    status: "Exploring",
    tags: ["Real Estate", "Reputation"],
    description: "Decentralized rental reputation system",
    order: 4,
  },
  {
    title: "Cherry",
    status: "Vision",
    tags: ["Urban Agriculture", "Sustainability"],
    description: "Network for rooftop agriculture and regenerative infrastructure",
    order: 5,
  },
];
```

### 9.8 Links Data (from config/links.ts)

```typescript
// scripts/data/links.ts
export const existingLinks = [
  // Social
  { category: "social", name: "github", url: "https://github.com/saharbarak", label: "GitHub" },
  { category: "social", name: "linkedin", url: "https://linkedin.com/in/saharbarak", label: "LinkedIn" },
  { category: "social", name: "twitter", url: "https://twitter.com/saharbarak", label: "Twitter" },
  { category: "social", name: "instagram", url: "https://instagram.com/saharbarak", label: "Instagram" },
  { category: "social", name: "discord", url: "https://discord.gg/YuqzGjBG", label: "Discord" },
  { category: "social", name: "devto", url: "https://dev.to/saharbarak", label: "Dev.to" },
  { category: "social", name: "substack", url: "https://substack.com/@saharbarak", label: "Substack" },
  { category: "social", name: "huggingface", url: "https://huggingface.co/SaharBarak", label: "HuggingFace" },

  // Professional
  { category: "professional", name: "calendly", url: "https://calendly.com/sahar-h-barak/30min", label: "Book a Call" },
  { category: "professional", name: "email", url: "mailto:sahar.h.barak@gmail.com", label: "Email" },

  // Support
  { category: "support", name: "patreon", url: "https://www.patreon.com/bePatron?u=111653068", label: "Patreon" },
  { category: "support", name: "buymeacoffee", url: "https://www.buymeacoffee.com/saharbarak", label: "Buy Me a Coffee" },
  { category: "support", name: "kofi", url: "https://ko-fi.com/saharbarak", label: "Ko-fi" },

  // External
  { category: "external", name: "twocirclestudios", url: "https://twocirclestudios.com", label: "Two Circle Studios" },
];
```

### 9.9 Availability Data (default)

```typescript
// scripts/data/availability.ts
export const defaultAvailability = {
  isAvailable: true,
  status: "Available",
  message: null, // Uses default "Available {Month} {Year}"
  calendlyUrl: "https://calendly.com/sahar-h-barak/30min",
};
```

### 9.10 Export Commands

```bash
# Extract data from components to scripts/data/
npm run extract-data

# Create Notion databases with proper schema
npm run setup-notion-dbs

# Export all data to Notion
npm run export-to-notion

# Export specific content type
npm run export-to-notion -- --only=projects
npm run export-to-notion -- --only=research,contributions
```

---

## 10. Content Authoring Workflow (User Experience)

### 10.1 How Simple Is It?

**Adding a new blog post:**
```
1. Open Notion → Blog database
2. Click "+ New"
3. Fill in: Title, write content, add tags
4. Check "Published" ✓
5. Done. Live on site.
```

**That's it.** No code. No terminal. No deployments.

### 10.2 Notion Database View

Each database is a table where each row = one item on your site:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Projects Database                                              [+ New]  │
├──────────────────┬─────────────────┬──────────────┬───────┬───────────────┤
│ Title            │ Subtitle        │ URL          │ Order │ Published     │
├──────────────────┼─────────────────┼──────────────┼───────┼───────────────┤
│ Wessley AI       │ Virtual Garage  │ wessley.ai   │ 1     │ ✓             │
│ Karen CLI        │ Layout Testing  │ karencli.dev │ 2     │ ✓             │
│ The Peace Board  │ Peace Pledges   │ thepeace...  │ 3     │ ✓             │
│ Two Circle       │ Product Studio  │ twocircle... │ 4     │ ✓             │
│ + New project... │                 │              │       │               │
└──────────────────┴─────────────────┴──────────────┴───────┴───────────────┘
```

### 10.3 Adding New Content (Step by Step)

#### Add a New Project:
```
1. Click "+ New" in Projects database
2. Fill fields:
   - Title: "My New Startup"
   - Subtitle: "AI-powered widget"
   - Description: "Description here..."
   - URL: https://mynewstartup.com
   - Logo: [drag & drop image]
   - BgColor: #1a1a2e
   - AccentColor: #e94560
   - Order: 5
   - Published: ✓
3. That's it. Syncs automatically.
```

#### Add a New Blog Post:
```
1. Click "+ New" in Blog database
2. Fill metadata fields:
   - Title: "How I Built X"
   - Slug: "how-i-built-x"
   - Date: [pick date]
   - Tags: [select: AI, Tutorial]
   - Cover Image: [drag & drop]
   - Published: ✓
3. Click into the page to write content
4. Write using Notion's full rich editor
5. Available at /blog/how-i-built-x
```

#### Blog Writing Experience (Long-Form Content):

Clicking into a blog row opens a **full-page editor**:

```
┌────────────────────────────────────────────────────────────────┐
│ 📝 How I Built a Real-Time CMS                                 │
│                                                                │
│ [Metadata: Slug, Date, Tags, Published ✓]                      │
│ ─────────────────────────────────────────────────────────────  │
│                                                                │
│ # Introduction                                                 │
│                                                                │
│ Write your full blog post here using Notion's rich editor.    │
│                                                                │
│ ## Features You Can Use:                                       │
│                                                                │
│ - **Bold**, *italic*, `inline code`                           │
│ - Code blocks with syntax highlighting                        │
│ - Images (drag & drop or paste)                               │
│ - Embeds (YouTube, Twitter, CodePen)                          │
│ - Tables, callouts, toggle lists                              │
│ - Math equations (LaTeX)                                      │
│                                                                │
│ ```typescript                                                  │
│ const data = await fetchQuery(api.blog.list);                 │
│ ```                                                            │
│                                                                │
│ > Blockquotes render beautifully                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Notion → Markdown conversion** handles:
- Headings, paragraphs, lists
- Code blocks (with language detection)
- Images (uploaded to your storage)
- Embeds (converted to iframes)
- Tables, callouts, dividers

**Keyboard shortcuts:**
- `/h1`, `/h2`, `/h3` → Headings
- `/code` → Code block
- `/image` → Insert image
- `/callout` → Info box
- `Cmd+B` → Bold
- `Cmd+I` → Italic
- `Cmd+E` → Inline code

#### Add New Freelance Work:
```
1. Click "+ New" in Freelance database
2. Fill fields:
   - Title: "E-commerce Redesign"
   - Client: "Acme Corp" (or leave blank for NDA)
   - Description: "Built a full-stack..."
   - URL: https://client-site.com
   - Testimonial: "Sahar delivered beyond..."
   - Tags: [Next.js, E-commerce]
   - Published: ✓
3. Shows in Freelance Showcase section
```

#### Update Availability:
```
1. Open Availability database (single row)
2. Change:
   - Status: "Booked" / "Limited" / "Available"
   - Message: "Fully booked until February"
3. Header badge updates instantly
```

### 10.4 Sync Options

| Method | How It Works | Delay |
|--------|--------------|-------|
| Manual | Run `npm run sync` | Instant |
| Auto (webhook) | Notion → webhook → Convex | ~2-5 seconds |
| Scheduled | Cron job every 5 min | Up to 5 min |

### 10.5 Mobile Editing

Since it's Notion, you can:
- Add blog posts from your phone
- Update availability while traveling
- Add new projects from iPad
- Full rich-text editing on any device

### 10.6 No More:

| Before (Hardcoded) | After (Notion CMS) |
|--------------------|-------------------|
| Open VS Code | Open Notion |
| Find the right file | Click database |
| Edit TypeScript array | Fill in form fields |
| Commit changes | Check "Published" |
| Push to GitHub | Done |
| Wait for Vercel build | Instant |
| **~5-10 minutes** | **~30 seconds** |

---

## 11. Migration Plan

### Phase 1: Setup (Day 1)
- [ ] Install Convex SDK
- [ ] Create Convex project and schema
- [ ] Set up Notion databases (9 total)
- [ ] Create sync script foundation

### Phase 2: Core Sync (Day 2-3)
- [ ] Implement Notion API client
- [ ] Build transformers for each content type
- [ ] Test sync with Projects and Blog
- [ ] Add remaining content types

### Phase 3: Frontend Integration (Day 4-5)
- [ ] Add Convex provider to app
- [ ] Create content hooks
- [ ] Migrate hardcoded components to use hooks
- [ ] Build new Blog pages
- [ ] Build Freelance Showcase section
- [ ] Add Availability Badge

### Phase 4: Polish (Day 6)
- [ ] Add loading states
- [ ] Error boundaries
- [ ] Fallback to cached content
- [ ] Test real-time updates

### Phase 5: Deploy & Document (Day 7)
- [ ] Deploy Convex to production
- [ ] Set up webhook (optional)
- [ ] Document sync workflow
- [ ] Initial content migration

---

## 10. File Structure (Final)

```
portfolio-v2/
├── convex/
│   ├── schema.ts
│   ├── projects.ts
│   ├── freelance.ts
│   ├── research.ts
│   ├── contributions.ts
│   ├── blog.ts
│   ├── ideas.ts
│   ├── now.ts
│   ├── links.ts
│   └── availability.ts
├── scripts/
│   ├── sync.ts
│   ├── notion-client.ts
│   └── transformers/
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── api/
│   │   │   └── webhook/notion/route.ts
│   │   └── providers.tsx
│   ├── components/
│   │   ├── home/
│   │   │   └── FreelanceShowcase.tsx
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogPost.tsx
│   │   └── ui/
│   │       └── AvailabilityBadge.tsx
│   ├── hooks/
│   │   └── useContent.ts
│   └── lib/
│       └── sync.ts
└── docs/
    └── PRD-notion-convex-cms.md
```

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Content update time | < 30 seconds (sync) |
| Page load (with content) | < 1.5s |
| Real-time update latency | < 500ms |
| Zero rebuilds for content | 100% |

---

## 12. Open Questions

1. **Notion images**: Host on Notion or upload to Vercel Blob/Cloudinary?
2. **Blog content**: Store as Markdown or rendered HTML?
3. **Caching strategy**: Client-side only or add edge caching?
4. **Webhook provider**: Native Notion webhooks vs Zapier/Make?

---

## 13. [OPTIONAL] Comments & Likes with Authentication

> **Priority:** Low - Implement only after core CMS is stable
> **Complexity:** Medium
> **Dependency:** Clerk (free tier: 10,000 MAU)

### 13.1 Overview

Enable authenticated users to like and comment on blog posts using Clerk for authentication and Convex for storage.

```
┌─────────────────────────────────────────────────────────────────┐
│  Blog Post                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  [Content...]                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ❤️ 24 likes    [♡ Like]                                       │
│                                                                 │
│  💬 Comments (3)                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔘 @dev123 · 2h ago                                      │   │
│  │ Great post!                                   [Reply] 👍 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Sign in with GitHub] [Google] to comment                     │
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Why Clerk?

- Native Convex integration
- Pre-built UI components (SignInButton, UserButton)
- Multiple OAuth providers (GitHub, Google, Twitter)
- Free tier: 10,000 monthly active users

### 13.3 Additional Schema

```typescript
// convex/schema.ts (additions)

users: defineTable({
  clerkId: v.string(),
  name: v.string(),
  email: v.string(),
  imageUrl: v.optional(v.string()),
  username: v.optional(v.string()),
}).index("by_clerk_id", ["clerkId"]),

likes: defineTable({
  postId: v.id("blog"),
  userId: v.id("users"),
  createdAt: v.number(),
}).index("by_post", ["postId"])
  .index("by_user_post", ["userId", "postId"]),

comments: defineTable({
  postId: v.id("blog"),
  userId: v.id("users"),
  content: v.string(),
  createdAt: v.number(),
  parentId: v.optional(v.id("comments")),
}).index("by_post", ["postId"]),
```

### 13.4 Mutations

```typescript
// convex/likes.ts
export const toggle = mutation({
  args: { postId: v.id("blog") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId,
        createdAt: Date.now(),
      });
    }
  },
});

// convex/comments.ts
export const create = mutation({
  args: {
    postId: v.id("blog"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("comments", {
      postId: args.postId,
      userId,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
```

### 13.5 Components

```typescript
// src/components/blog/LikeButton.tsx
"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export function LikeButton({ postId }) {
  const { isSignedIn } = useUser();
  const count = useQuery(api.likes.count, { postId });
  const toggle = useMutation(api.likes.toggle);

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button>♡ {count ?? 0}</button>
      </SignInButton>
    );
  }

  return <button onClick={() => toggle({ postId })}>❤️ {count}</button>;
}
```

### 13.6 Setup Steps (When Ready)

1. Create Clerk account → get API keys
2. `npm install @clerk/nextjs`
3. Add ClerkProvider to app layout
4. Configure Convex auth with Clerk JWT
5. Add users, likes, comments tables to schema
6. Build LikeButton and CommentSection components
7. Add to blog post pages

### 13.7 Optional Enhancements

- Comment replies (nested threads)
- Comment moderation (approve before publish)
- Like notifications (email or push)
- Comment markdown support
- Spam detection (Akismet integration)

---

## 14. Dependencies

```json
{
  "dependencies": {
    "convex": "^1.x",
    "@notionhq/client": "^2.x",
    "notion-to-md": "^3.x"
  },
  "optionalDependencies": {
    "@clerk/nextjs": "^5.x"
  }
}
```

---

**Status:** Draft
**Next Steps:** Review with stakeholder, then begin Phase 1

---

## Priority Order

| Phase | Feature | Priority |
|-------|---------|----------|
| 1 | Convex setup + schema | **Required** |
| 2 | Notion sync pipeline | **Required** |
| 3 | Export existing data to Notion | **Required** |
| 4 | Migrate components to use Convex | **Required** |
| 5 | Blog section (/blog, /blog/[slug]) | **Required** |
| 6 | Freelance showcase section | **Required** |
| 7 | Availability badge | **Required** |
| 8 | Auto-sync webhook | Nice to have |
| 9 | Comments & Likes (Clerk auth) | **Optional** |
