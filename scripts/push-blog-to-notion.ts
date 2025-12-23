/**
 * Push Blog Post to Notion
 *
 * Creates a new blog post in Notion with full content
 * Run with: npx ts-node scripts/push-blog-to-notion.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_BLOG_DB = process.env.NOTION_BLOG_DB;

interface BlockContent {
  type: string;
  content: string;
  language?: string;
}

function parseMarkdownToBlocks(markdown: string): BlockContent[] {
  const blocks: BlockContent[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Code blocks
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "plain_text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: "code",
        content: codeLines.join("\n"),
        language,
      });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      blocks.push({ type: "heading_1", content: line.slice(2) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "heading_2", content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "heading_3", content: line.slice(4) });
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      blocks.push({ type: "divider", content: "" });
      i++;
      continue;
    }

    // Bulleted list
    if (line.startsWith("- ")) {
      blocks.push({ type: "bulleted_list_item", content: line.slice(2) });
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      blocks.push({
        type: "numbered_list_item",
        content: line.replace(/^\d+\.\s/, ""),
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", content: line.slice(2) });
      i++;
      continue;
    }

    // Regular paragraph - collect consecutive non-empty lines
    const paragraphLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("> ") &&
      !/^\d+\.\s/.test(lines[i]) &&
      lines[i].trim() !== "---"
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", content: paragraphLines.join(" ") });
  }

  return blocks;
}

function createNotionBlock(block: BlockContent): any {
  const richText = [
    {
      type: "text",
      text: { content: block.content.slice(0, 2000) }, // Notion limit
    },
  ];

  switch (block.type) {
    case "heading_1":
      return { object: "block", type: "heading_1", heading_1: { rich_text: richText } };
    case "heading_2":
      return { object: "block", type: "heading_2", heading_2: { rich_text: richText } };
    case "heading_3":
      return { object: "block", type: "heading_3", heading_3: { rich_text: richText } };
    case "paragraph":
      return { object: "block", type: "paragraph", paragraph: { rich_text: richText } };
    case "bulleted_list_item":
      return { object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: richText } };
    case "numbered_list_item":
      return { object: "block", type: "numbered_list_item", numbered_list_item: { rich_text: richText } };
    case "quote":
      return { object: "block", type: "quote", quote: { rich_text: richText } };
    case "divider":
      return { object: "block", type: "divider", divider: {} };
    case "code":
      return {
        object: "block",
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: block.content.slice(0, 2000) } }],
          language: block.language || "plain_text",
        },
      };
    default:
      return { object: "block", type: "paragraph", paragraph: { rich_text: richText } };
  }
}

async function createBlogPost() {
  if (!NOTION_API_KEY || !NOTION_BLOG_DB) {
    console.error("Missing NOTION_API_KEY or NOTION_BLOG_DB in .env.local");
    process.exit(1);
  }

  const blogContent = `# Building a Real-Time CMS with Notion and Convex: The Full Journey

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

- FeaturedWork.tsx - Projects
- ResearchContributions.tsx - Research papers
- OpenSourceCode.tsx - GitHub repos and npm packages
- ideas/page.tsx - Ideas section
- now/page.tsx - Current activities
- config/links.ts - 30+ URLs

Every file had its own data structure. Some used arrays of objects, others had inline JSX. There was no consistency, no single source of truth, and no way to update content without touching code.

---

## The Requirements: What I Actually Needed

Before jumping into solutions, I mapped out what I actually needed:

### Must-haves:
- Zero rebuilds for content changes
- Mobile-friendly editing (ideas strike anywhere)
- Type-safe content schemas (I'm not going back to runtime errors)
- Support for 9 different content types
- Real-time updates (no cache invalidation headaches)

### Nice-to-haves:
- Familiar editing interface
- Rich text for blog posts
- Markdown support
- Media handling

### Deal-breakers:
- No CMS lock-in (I should own my data)
- No monthly fees that scale with usage
- No complex self-hosted infrastructure

---

## Why Notion + Convex? The Decision Process

### Option 1: Traditional Headless CMS (Contentful, Sanity)

**Pros:** Purpose-built for content management, great APIs, media handling

**Cons:** Learning curve for custom schemas, pricing scales with content/users, yet another login to manage, some have rebuild requirements

### Option 2: Git-based CMS (Netlify CMS, TinaCMS)

**Pros:** Version control, works with existing workflow

**Cons:** Still requires rebuilds, not mobile-friendly, limited rich-text capabilities

### Option 3: Database + Custom Admin (Postgres + Admin Panel)

**Pros:** Full control

**Cons:** Have to build an entire admin interface, authentication, authorization, the whole stack. Massive time investment.

### Option 4: Notion as CMS + Real-time Database

**Pros:** I already use Notion daily, mobile app is excellent, rich text editor is best-in-class, free for personal use, API is mature

**Cons:** API rate limits, not designed as a CMS, need a real-time layer on top

This is where **Convex** enters the picture. Instead of querying Notion directly (slow, rate-limited, no real-time), I use Convex as a real-time database layer.

The sync script pulls from Notion and pushes to Convex. The frontend queries Convex directly, getting sub-100ms responses and real-time subscriptions.

---

## Architecture Deep Dive

### The Data Flow

Notion Tables (9 databases) --> Sync Script (TypeScript) --> Convex DB (Real-time) --> Next.js App (React hooks)

### Content Schema Design

I designed 9 Convex tables to match my content types:

1. **Projects** - Featured work with custom color schemes
2. **Freelance** - Client work with testimonials
3. **Research** - Papers and explorations with status tracking
4. **Contributions** - GitHub repos and npm packages
5. **Blog** - Full posts with markdown content
6. **Ideas** - Concepts and prototypes
7. **Now** - Current activities (nownownow.com pattern)
8. **Links** - Centralized URL management
9. **Availability** - Real-time booking status

Each table has a notionId field for sync identification and a syncedAt timestamp for debugging.

---

## The Sync Script: Bridge Between Worlds

The sync script is the heart of this system. Here's how it works:

### Fetching from Notion

The script handles pagination (Notion limits 100 results per request), extracts data from various property types, and for blog posts, fetches page content (blocks) separately.

### Extracting Notion Properties

The trickiest part was handling Notion's different property types:

- **title** - Page title
- **rich_text** - Regular text fields
- **multi_select** - Arrays of tags
- **select** - Single choice fields
- **checkbox** - Boolean values
- **url** - URL fields
- **date** - Date fields
- **number** - Numeric values

Each requires different extraction logic.

### Convex Upsert Pattern

Each content type has an upsert mutation that checks for existing records by notionId and either updates or inserts accordingly. This makes the sync idempotent - you can run it multiple times safely.

---

## Frontend Integration

On the frontend, I created a useContent.ts hook file that wraps all Convex queries:

- useProjects()
- useFreelance()
- useResearch()
- useContributions()
- useBlogPosts()
- useBlogPost(slug)
- useIdeas()
- useNow()
- useLinks()
- useAvailability()

Components simply call these hooks and get real-time data. When I update content in Notion and run sync, the components update automatically. No refresh needed.

---

## What I Learned

### 1. Notion's API Has Quirks

- Property types are inconsistent (rich_text vs title vs select)
- Pagination is required for databases with 100+ items
- Block content requires separate API calls
- Rate limits are generous but exist

### 2. Convex is Genuinely Real-Time

I was skeptical about "real-time" claims, but Convex delivers. Updates appear in under 500ms without any polling or WebSocket setup. The useQuery hook just works.

### 3. Schema Design Matters

I initially had all content in one table with a type field. Bad idea. Separate tables with specific schemas made queries faster and type inference perfect.

### 4. The "Published" Flag is Essential

Every content type has a published: boolean field. This lets me draft content in Notion without it appearing on the site. Simple but crucial.

### 5. Indexes Are Not Optional

Without proper indexes, Convex queries scan entire tables. I added indexes for every field I filter or sort by: by_order, by_published, by_notion_id.

---

## The Result

### Before:
- 5-10 minutes to update content
- Required laptop and VS Code
- Risk of breaking builds
- No preview before publish

### After:
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

- Convex Documentation: https://docs.convex.dev
- Notion API Reference: https://developers.notion.com
- This portfolio's source code: https://github.com/SaharBarak/portfolio-v2

---

If you're building something similar and have questions, reach out on Twitter or book a call. I'm happy to help.`;

  // Parse markdown to blocks
  const parsedBlocks = parseMarkdownToBlocks(blogContent);
  const notionBlocks = parsedBlocks.map(createNotionBlock);

  // Create the page with properties
  const today = new Date().toISOString().split("T")[0];

  console.log("\n📝 Creating blog post in Notion...\n");

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_BLOG_DB },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: "Building a Real-Time CMS with Notion and Convex: The Full Journey",
              },
            },
          ],
        },
        Slug: {
          rich_text: [{ text: { content: "building-realtime-cms-notion-convex" } }],
        },
        Date: {
          date: { start: today },
        },
        Tags: {
          multi_select: [
            { name: "Convex" },
            { name: "Notion" },
            { name: "Next.js" },
            { name: "Tutorial" },
          ],
        },
        Excerpt: {
          rich_text: [
            {
              text: {
                content: "How I eliminated code deployments for content updates and built a zero-rebuild content management system with Notion as the authoring layer and Convex for real-time delivery.",
              },
            },
          ],
        },
        Published: {
          checkbox: true,
        },
      },
      // Notion has a limit of 100 blocks per request
      children: notionBlocks.slice(0, 100),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error("❌ Error creating page:", result);
    process.exit(1);
  }

  console.log("✅ Blog post created in Notion!");
  console.log(`   URL: ${result.url}`);

  // If we have more than 100 blocks, append them
  if (notionBlocks.length > 100) {
    console.log(`\n📎 Appending remaining ${notionBlocks.length - 100} blocks...`);

    const pageId = result.id;
    const remainingBlocks = notionBlocks.slice(100);

    // Append in batches of 100
    for (let i = 0; i < remainingBlocks.length; i += 100) {
      const batch = remainingBlocks.slice(i, i + 100);

      const appendResponse = await fetch(
        `https://api.notion.com/v1/blocks/${pageId}/children`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${NOTION_API_KEY}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify({ children: batch }),
        }
      );

      if (!appendResponse.ok) {
        const err = await appendResponse.json();
        console.error("⚠️  Error appending blocks:", err);
      }
    }

    console.log("✅ All blocks appended!");
  }

  console.log("\n🔄 Now run 'npm run notion:sync' to sync to Convex\n");
}

createBlogPost().catch(console.error);
