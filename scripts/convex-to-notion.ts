/**
 * Sync Convex → Notion
 *
 * Pulls data from Convex and pushes to Notion databases
 * Run with: npx ts-node scripts/convex-to-notion.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!NOTION_API_KEY || !CONVEX_URL) {
  console.error("❌ Missing NOTION_API_KEY or NEXT_PUBLIC_CONVEX_URL");
  process.exit(1);
}

// Query Convex
async function queryConvex(functionName: string, args: any = {}) {
  const response = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionName, args }),
  });
  const data = await response.json();
  if (data.status === "error") {
    console.error(`Convex error (${functionName}):`, data.errorMessage);
    return null;
  }
  return data.value;
}

// Create Notion page
async function createNotionPage(databaseId: string, properties: Record<string, any>) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error(`   ❌ Notion error:`, data.message || data);
    return null;
  }
  return data;
}

// Helpers
function richText(content: string) {
  return { rich_text: [{ text: { content: content || "" } }] };
}

function title(content: string) {
  return { title: [{ text: { content: content || "" } }] };
}

function number(value: number) {
  return { number: value || 0 };
}

function checkbox(value: boolean) {
  return { checkbox: Boolean(value) };
}

function select(name: string) {
  return name ? { select: { name } } : { select: null };
}

function multiSelect(names: string[]) {
  return { multi_select: (names || []).map((name) => ({ name })) };
}

function url(value: string) {
  return { url: value || null };
}

function date(value: string) {
  return value ? { date: { start: value } } : { date: null };
}

// Sync Projects
async function syncProjects() {
  const dbId = process.env.NOTION_PROJECTS_DB;
  if (!dbId) return;

  console.log("📦 Syncing Projects from Convex → Notion...");
  const projects = await queryConvex("projects:list");
  if (!projects || projects.length === 0) {
    console.log("   ⏭️  No projects in Convex");
    return;
  }

  for (const p of projects) {
    const result = await createNotionPage(dbId, {
      Name: title(p.title),
      Subtitle: richText(p.subtitle || ""),
      Description: richText(p.description || ""),
      URL: url(p.url),
      Logo: richText(p.logo || ""),
      BgColor: richText(p.colors?.bg || ""),
      AccentColor: richText(p.colors?.accent || ""),
      TextColor: richText(p.colors?.text || ""),
      TextMuted: richText(p.colors?.textMuted || ""),
      Order: number(p.order),
      Published: checkbox(p.published),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.title}`);
  }
}

// Sync Freelance
async function syncFreelance() {
  const dbId = process.env.NOTION_FREELANCE_DB;
  if (!dbId) return;

  console.log("📦 Syncing Freelance from Convex → Notion...");
  const items = await queryConvex("freelance:list");
  if (!items || items.length === 0) {
    console.log("   ⏭️  No freelance in Convex");
    return;
  }

  for (const p of items) {
    const result = await createNotionPage(dbId, {
      Name: title(p.title),
      Client: richText(p.client || ""),
      Description: richText(p.description || ""),
      URL: url(p.url),
      Logo: richText(p.logo || ""),
      BgColor: richText(p.colors?.bg || ""),
      AccentColor: richText(p.colors?.accent || ""),
      TextColor: richText(p.colors?.text || ""),
      Testimonial: richText(p.testimonial || ""),
      Tags: multiSelect(p.tags || []),
      Order: number(p.order),
      Published: checkbox(p.published),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.title}`);
  }
}

// Sync Research
async function syncResearch() {
  const dbId = process.env.NOTION_RESEARCH_DB;
  if (!dbId) return;

  console.log("📦 Syncing Research from Convex → Notion...");
  const items = await queryConvex("research:list");
  if (!items || items.length === 0) {
    console.log("   ⏭️  No research in Convex");
    return;
  }

  for (const p of items) {
    const result = await createNotionPage(dbId, {
      Name: title(p.title),
      Subtitle: richText(p.subtitle || ""),
      Description: richText(p.description || ""),
      Status: select(p.status),
      Field: select(p.field),
      Links: richText(JSON.stringify(p.links || [])),
      References: richText(JSON.stringify(p.references || [])),
      Order: number(p.order),
      Published: checkbox(p.published),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.title}`);
  }
}

// Sync Contributions
async function syncContributions() {
  const dbId = process.env.NOTION_CONTRIBUTIONS_DB;
  if (!dbId) return;

  console.log("📦 Syncing Contributions from Convex → Notion...");
  const items = await queryConvex("contributions:list");
  if (!items || items.length === 0) {
    console.log("   ⏭️  No contributions in Convex");
    return;
  }

  for (const p of items) {
    const result = await createNotionPage(dbId, {
      Name: title(p.name),
      Description: richText(p.description || ""),
      Type: select(p.type),
      URL: url(p.url),
      Stars: number(p.stars || 0),
      PRs: number(p.prs || 0),
      Language: richText(p.language || ""),
      Downloads: richText(p.downloads || ""),
      Version: richText(p.version || ""),
      Order: number(p.order),
      Published: checkbox(p.published),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.name}`);
  }
}

// Sync Blog
async function syncBlog() {
  const dbId = process.env.NOTION_BLOG_DB;
  if (!dbId) return;

  console.log("📦 Syncing Blog from Convex → Notion...");
  const items = await queryConvex("blog:list");
  if (!items || items.length === 0) {
    console.log("   ⏭️  No blog posts in Convex");
    return;
  }

  for (const p of items) {
    const result = await createNotionPage(dbId, {
      Name: title(p.title),
      Slug: richText(p.slug),
      Date: date(p.date),
      Tags: multiSelect(p.tags || []),
      Excerpt: richText(p.excerpt || ""),
      CoverImage: url(p.coverImage),
      Published: checkbox(p.published),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.title}`);
  }
}

// Sync Links
async function syncLinks() {
  const dbId = process.env.NOTION_LINKS_DB;
  if (!dbId) return;

  console.log("📦 Syncing Links from Convex → Notion...");
  const items = await queryConvex("links:list");
  if (!items || items.length === 0) {
    console.log("   ⏭️  No links in Convex");
    return;
  }

  for (const p of items) {
    const result = await createNotionPage(dbId, {
      Name: title(p.name),
      Category: select(p.category),
      URL: url(p.url),
      Label: richText(p.label || ""),
    });
    console.log(`   ${result ? "✅" : "❌"} ${p.name}`);
  }
}

async function main() {
  console.log("\n🔄 Syncing Convex → Notion...\n");

  await syncProjects();
  await syncFreelance();
  await syncResearch();
  await syncContributions();
  await syncBlog();
  await syncLinks();

  console.log("\n✅ Sync complete!\n");
}

main().catch(console.error);
