/**
 * Add CMS Portfolio Enhancement Content
 *
 * Adds a project and blog post about the Notion + Convex CMS integration
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function createPage(databaseId: string, properties: any, children?: any[]): Promise<any> {
  const body: any = {
    parent: { database_id: databaseId },
    properties,
  };

  if (children) {
    body.children = children;
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Error:", data);
    return null;
  }
  return data;
}

async function main() {
  console.log("\n📝 Adding CMS Portfolio Enhancement content...\n");

  // 1. Add Blog Post
  const blogDbId = process.env.NOTION_BLOG_DB;
  if (blogDbId) {
    console.log("📰 Creating blog post...");

    const blogContent = [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "I just shipped a major upgrade to my portfolio: a real-time CMS powered by Notion and Convex. No more hardcoded content, no more rebuilds for typo fixes. Edit in Notion, sync to Convex, and the site updates instantly.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "The Problem" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "My portfolio had all content hardcoded in React components. Every time I wanted to update a project description, add a new research item, or fix a typo, I had to:",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Open VS Code" } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Find the right component" } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Edit the hardcoded array" } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: "Commit, push, wait for deploy" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "For a portfolio that's supposed to showcase my engineering skills, this felt embarrassingly manual.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "The Solution: Notion + Convex" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "I built a proper CMS using Notion as the content authoring interface and Convex as the real-time database. Here's how it works:",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Edit content in Notion " },
            },
            {
              type: "text",
              text: { content: "— familiar interface, rich editing, mobile-friendly" },
              annotations: { color: "gray" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Run sync script " },
            },
            {
              type: "text",
              text: { content: "— pulls from Notion API, pushes to Convex" },
              annotations: { color: "gray" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Site updates instantly " },
            },
            {
              type: "text",
              text: { content: "— Convex pushes changes to all connected clients" },
              annotations: { color: "gray" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Technical Highlights" } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "9 Notion databases " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: {
                content: "— Projects, Freelance, Research, Contributions, Blog, Ideas, Now, Links, Availability",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Type-safe queries " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: "— Convex generates TypeScript types from schema" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Graceful fallbacks " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: "— Components show static data while loading" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Bug discovery " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: {
                content: "— The @notionhq/client npm package silently strips database properties. Had to use raw fetch() instead.",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "New Features Unlocked" } }],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Blog section " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: "— Write posts in Notion, publish to /blog" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Availability badge " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: "— Shows current status with Calendly integration" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [
            {
              type: "text",
              text: { content: "Freelance showcase " },
              annotations: { bold: true },
            },
            {
              type: "text",
              text: { content: "— Dedicated section for client work" },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "\nThis post you're reading? Written in Notion, synced via the pipeline I just built. Meta.",
              },
              annotations: { italic: true },
            },
          ],
        },
      },
    ];

    const blogPost = await createPage(
      blogDbId,
      {
        Name: { title: [{ text: { content: "Building a Real-Time CMS with Notion and Convex" } }] },
        Slug: { rich_text: [{ text: { content: "notion-convex-cms" } }] },
        Date: { date: { start: new Date().toISOString().split("T")[0] } },
        Tags: { multi_select: [{ name: "Engineering" }, { name: "Next.js" }, { name: "Convex" }] },
        Excerpt: {
          rich_text: [
            {
              text: {
                content:
                  "How I replaced hardcoded portfolio content with a Notion-powered CMS that syncs to Convex for real-time updates. No rebuilds required.",
              },
            },
          ],
        },
        Published: { checkbox: true },
      },
      blogContent
    );

    if (blogPost) {
      console.log("   ✅ Blog post created:", blogPost.id);
    }
  }

  // 2. Add Project
  const projectsDbId = process.env.NOTION_PROJECTS_DB;
  if (projectsDbId) {
    console.log("🚀 Creating project entry...");

    const project = await createPage(projectsDbId, {
      Name: { title: [{ text: { content: "Portfolio CMS" } }] },
      Subtitle: { rich_text: [{ text: { content: "Notion + Convex" } }] },
      Description: {
        rich_text: [
          {
            text: {
              content:
                "Real-time content management for my portfolio. Edit in Notion, sync to Convex, site updates instantly. No rebuilds.",
            },
          },
        ],
      },
      URL: { url: "https://github.com/SaharBarak/portfolio-v2" },
      Logo: { rich_text: [{ text: { content: "/ventures/portfolio-cms.svg" } }] },
      BgColor: { rich_text: [{ text: { content: "#1a1a2e" } }] },
      AccentColor: { rich_text: [{ text: { content: "#8b5cf6" } }] },
      TextColor: { rich_text: [{ text: { content: "#ffffff" } }] },
      TextMuted: { rich_text: [{ text: { content: "rgba(255,255,255,0.5)" } }] },
      Order: { number: 5 },
      Published: { checkbox: true },
    });

    if (project) {
      console.log("   ✅ Project created:", project.id);
    }
  }

  console.log("\n✅ Content added!");
  console.log("   Run 'npm run notion:sync' to sync to Convex.\n");
}

main().catch(console.error);
