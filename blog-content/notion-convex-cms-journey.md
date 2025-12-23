# Building a Real-Time CMS with Notion and Convex: The Full Journey

*How I eliminated code deployments for content updates and built a zero-rebuild content management system*

---

## The Problem: Death by Deployments

Every time I wanted to add a new project to my portfolio, update my availability status, or write a quick blog post, I had to:

1. Open VS Code
2. Find the right TypeScript file
3. Edit a hardcoded array
4. Commit the changes
5. Push to GitHub
6. Wait for Vercel to rebuild
7. Hope nothing broke

**Total time: 5-10 minutes for a one-line text change.**

The friction was real. I'd have ideas for blog posts while on the train, but by the time I got to my laptop, opened the editor, and remembered the file structure... the moment had passed.

I had content spread across 10+ component files:
- `FeaturedWork.tsx` - Projects
- `ResearchContributions.tsx` - Research papers
- `OpenSourceCode.tsx` - GitHub repos and npm packages
- `ideas/page.tsx` - Ideas section
- `now/page.tsx` - Current activities
- `config/links.ts` - 30+ URLs

Every file had its own data structure. Some used arrays of objects, others had inline JSX. There was no consistency, no single source of truth, and no way to update content without touching code.

---

## The Requirements: What I Actually Needed

Before jumping into solutions, I mapped out what I actually needed:

**Must-haves:**
- Zero rebuilds for content changes
- Mobile-friendly editing (ideas strike anywhere)
- Type-safe content schemas (I'm not going back to runtime errors)
- Support for 9 different content types
- Real-time updates (no cache invalidation headaches)

**Nice-to-haves:**
- Familiar editing interface
- Rich text for blog posts
- Markdown support
- Media handling

**Deal-breakers:**
- No CMS lock-in (I should own my data)
- No monthly fees that scale with usage
- No complex self-hosted infrastructure

---

## Why Notion + Convex? The Decision Process

### Option 1: Traditional Headless CMS (Contentful, Sanity)

**Pros:** Purpose-built for content management, great APIs, media handling

**Cons:**
- Learning curve for custom schemas
- Pricing scales with content/users
- Yet another login to manage
- Some have rebuild requirements for certain features

### Option 2: Git-based CMS (Netlify CMS, TinaCMS)

**Pros:** Version control, works with existing workflow

**Cons:**
- Still requires rebuilds
- Not mobile-friendly
- Limited rich-text capabilities

### Option 3: Database + Custom Admin (Postgres + Admin Panel)

**Pros:** Full control

**Cons:**
- Have to build an entire admin interface
- Authentication, authorization, the whole stack
- Massive time investment

### Option 4: Notion as CMS + Real-time Database

**Pros:**
- I already use Notion daily
- Mobile app is excellent
- Rich text editor is best-in-class
- Free for personal use
- API is mature

**Cons:**
- API rate limits
- Not designed as a CMS
- Need a real-time layer on top

This is where **Convex** enters the picture. Instead of querying Notion directly (slow, rate-limited, no real-time), I use Convex as a real-time database layer:

```
Notion (authoring) --> Sync Script --> Convex (serving) --> Next.js
```

The sync script pulls from Notion and pushes to Convex. The frontend queries Convex directly, getting sub-100ms responses and real-time subscriptions.

---

## Architecture Deep Dive

### The Data Flow

```
+------------------+        +---------------+        +------------------+
|                  |        |               |        |                  |
|  Notion Tables   |------->|  Sync Script  |------->|  Convex DB       |
|  (9 databases)   |  API   |  (TypeScript) |  HTTP  |  (Real-time)     |
|                  |        |               |        |                  |
+------------------+        +---------------+        +------------------+
                                                              |
                                                              | useQuery()
                                                              v
                                                     +------------------+
                                                     |                  |
                                                     |  Next.js App     |
                                                     |  (React hooks)   |
                                                     |                  |
                                                     +------------------+
```

### Content Schema Design

I designed 9 Convex tables to match my content types:

**1. Projects** - Featured work with custom color schemes
```typescript
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
  .index("by_published", ["published"])
```

**2. Freelance** - Client work with testimonials
**3. Research** - Papers and explorations with status tracking
**4. Contributions** - GitHub repos and npm packages
**5. Blog** - Full posts with markdown content
**6. Ideas** - Concepts and prototypes
**7. Now** - Current activities (nownownow.com pattern)
**8. Links** - Centralized URL management
**9. Availability** - Real-time booking status

Each table has a `notionId` field for sync identification and a `syncedAt` timestamp for debugging.

### The Sync Script

The sync script is the bridge between Notion and Convex. Here's how it works:

```typescript
// scripts/sync-notion.ts

async function fetchNotionDatabase(databaseId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let hasMore = true;
  let startCursor: string | undefined;

  // Handle pagination - Notion limits to 100 results per request
  while (hasMore) {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          start_cursor: startCursor,
          page_size: 100,
        }),
      }
    );

    const data = await response.json();
    pages.push(...data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return pages;
}
```

The trickiest part was extracting content from Notion's property types. Each property type has a different structure:

```typescript
// Helper to extract text from Notion rich_text
function getText(prop: any): string {
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text?.[0]?.plain_text || "";
}

// Helper to extract title from Notion title
function getTitle(prop: any): string {
  if (!prop || prop.type !== "title") return "";
  return prop.title?.[0]?.plain_text || "";
}

// Helper to extract multi_select
function getMultiSelect(prop: any): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return (prop.multi_select || []).map((item: any) => item.name);
}
```

For blog posts, I needed to fetch the page content (blocks), not just properties:

```typescript
async function fetchPageContent(pageId: string): Promise<string> {
  const response = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
    {
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
    }
  );

  const data = await response.json();
  let content = "";

  for (const block of data.results || []) {
    const type = block.type;
    const blockData = block[type];

    if (type === "paragraph" && blockData?.rich_text) {
      content += blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
    } else if (type === "heading_1" && blockData?.rich_text) {
      content += "# " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
    } else if (type === "code" && blockData?.rich_text) {
      const lang = blockData.language || "";
      content += "```" + lang + "\n" + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n```\n\n";
    }
    // ... handle other block types
  }

  return content.trim();
}
```

### Convex Mutations

Each content type has an `upsert` mutation that handles both inserts and updates:

```typescript
// convex/blog.ts
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
    // Check if this Notion page was already synced
    const existing = await ctx.db
      .query("blog")
      .withIndex("by_notion_id", (q) => q.eq("notionId", args.notionId))
      .first();

    const data = {
      ...args,
      syncedAt: Date.now(),
    };

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      // Insert new record
      return await ctx.db.insert("blog", data);
    }
  },
});
```

### Frontend Integration

On the frontend, I created a `useContent.ts` hook file that wraps all Convex queries:

```typescript
// src/hooks/useContent.ts
"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useProjects() {
  return useQuery(api.projects.list, {});
}

export function useBlogPosts() {
  return useQuery(api.blog.list, {});
}

export function useBlogPost(slug: string) {
  return useQuery(api.blog.getBySlug, { slug });
}

export function useAvailability() {
  return useQuery(api.availability.get, {});
}
```

Components simply call these hooks and get real-time data:

```typescript
// src/components/home/BlogPreview.tsx
export default function BlogPreview() {
  const posts = useBlogPosts();

  if (!posts?.length) return null;

  return (
    <section>
      {posts.slice(0, 3).map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </section>
  );
}
```

The beauty here: when I update content in Notion and run sync, the components update automatically. No refresh needed. Convex handles the real-time subscription under the hood.

---

## The Sync Workflow

### Manual Sync (Development)

```bash
npm run notion:sync
```

Output:
```
Syncing Notion -> Convex...

Projects...
   Wessley AI
   Karen CLI
   The Peace Board
   Two Circle Studios

Blog...
   Building a Real-Time CMS with Notion and Convex

Availability...
   Status: Available

Sync complete!
```

### Environment Setup

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

NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
```

---

## What I Learned

### 1. Notion's API Has Quirks

- Property types are inconsistent (rich_text vs title vs select)
- Pagination is required for databases with 100+ items
- Block content requires separate API calls
- Rate limits are generous but exist

### 2. Convex is Genuinely Real-Time

I was skeptical about "real-time" claims, but Convex delivers. Updates appear in under 500ms without any polling or WebSocket setup. The `useQuery` hook just works.

### 3. Schema Design Matters

I initially had all content in one table with a `type` field. Bad idea. Separate tables with specific schemas made queries faster and type inference perfect.

### 4. The "Published" Flag is Essential

Every content type has a `published: boolean` field. This lets me draft content in Notion without it appearing on the site. Simple but crucial.

### 5. Indexes Are Not Optional

Without proper indexes, Convex queries scan entire tables. I added indexes for every field I filter or sort by:

```typescript
.index("by_order", ["order"])
.index("by_published", ["published"])
.index("by_notion_id", ["notionId"])
```

---

## The Result

**Before:**
- 5-10 minutes to update content
- Required laptop and VS Code
- Risk of breaking builds
- No preview before publish

**After:**
- 30 seconds to update content
- Works from phone, tablet, anywhere
- Zero risk of breaking code
- Draft mode with published flag
- Real-time updates

The system now manages:
- 4 featured projects
- 5 research papers
- 6 open-source contributions
- Blog posts (growing)
- Ideas page
- Now page
- Availability status
- 30+ links

All from Notion. All real-time. All type-safe.

---

## What's Next

1. **Webhook automation** - Currently sync is manual. Next step is auto-sync on Notion changes.

2. **Image optimization** - Notion images work but could be optimized via Vercel Blob or Cloudinary.

3. **Comments and likes** - Considering Clerk auth + Convex for social features on blog posts.

4. **Search** - Full-text search across all content types using Convex's search index.

---

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Notion API Reference](https://developers.notion.com)
- [This portfolio's source code](https://github.com/SaharBarak/portfolio-v2)

---

*If you're building something similar and have questions, reach out on [Twitter](https://twitter.com/saharbarak) or book a [call](https://calendly.com/sahar-h-barak/30min). I'm happy to help.*
