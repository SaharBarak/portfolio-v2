/**
 * Sync Notion to Convex
 *
 * Pulls data from Notion databases and syncs to Convex
 * Run with: npm run notion:sync
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

interface NotionPage {
  id: string;
  properties: Record<string, any>;
}

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

// Helper to extract number
function getNumber(prop: any): number {
  if (!prop || prop.type !== "number") return 0;
  return prop.number || 0;
}

// Helper to extract checkbox
function getCheckbox(prop: any): boolean {
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox || false;
}

// Helper to extract select
function getSelect(prop: any): string {
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name || "";
}

// Helper to extract URL
function getUrl(prop: any): string {
  if (!prop || prop.type !== "url") return "";
  return prop.url || "";
}

// Helper to extract date
function getDate(prop: any): string {
  if (!prop || prop.type !== "date") return "";
  return prop.date?.start || "";
}

// Helper to extract multi_select
function getMultiSelect(prop: any): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return (prop.multi_select || []).map((item: any) => item.name);
}

async function fetchNotionDatabase(databaseId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let hasMore = true;
  let startCursor: string | undefined;

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

    if (!response.ok) {
      console.error(`Error fetching database ${databaseId}:`, data);
      return pages;
    }

    pages.push(...data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return pages;
}

async function syncToConvex(
  functionName: string,
  data: any
): Promise<boolean> {
  try {
    const response = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: functionName,
        args: data,
      }),
    });

    const result = await response.json();

    if (result.status === "error") {
      console.error(`   ⚠️  Convex error (${functionName}):`, result.errorMessage);
      return false;
    }

    return response.ok && result.status === "success";
  } catch (error) {
    console.error(`Error syncing to Convex (${functionName}):`, error);
    return false;
  }
}

async function syncProjects() {
  const dbId = process.env.NOTION_PROJECTS_DB;
  if (!dbId) return;

  console.log("📦 Syncing Projects...");
  const pages = await fetchNotionDatabase(dbId);

  for (const page of pages) {
    const p = page.properties;
    const data = {
      notionId: page.id,
      title: getTitle(p.Name),
      subtitle: getText(p.Subtitle),
      description: getText(p.Description),
      url: getUrl(p.URL),
      logo: getText(p.Logo) || undefined,
      colors: {
        bg: getText(p.BgColor),
        accent: getText(p.AccentColor),
        text: getText(p.TextColor),
        textMuted: getText(p.TextMuted) || undefined,
      },
      order: getNumber(p.Order),
      published: getCheckbox(p.Published),
    };

    const success = await syncToConvex("projects:upsert", data);
    console.log(`   ${success ? "✅" : "❌"} ${data.title}`);
  }
}

async function syncResearch() {
  const dbId = process.env.NOTION_RESEARCH_DB;
  if (!dbId) return;

  console.log("📦 Syncing Research...");
  const pages = await fetchNotionDatabase(dbId);

  for (const page of pages) {
    const p = page.properties;

    let links = [];
    let references = [];
    try {
      links = JSON.parse(getText(p.Links) || "[]");
      references = JSON.parse(getText(p.References) || "[]");
    } catch {}

    const data = {
      notionId: page.id,
      title: getTitle(p.Name),
      subtitle: getText(p.Subtitle),
      description: getText(p.Description),
      status: getSelect(p.Status) as "research" | "active" | "concept",
      field: getSelect(p.Field),
      links,
      references,
      order: getNumber(p.Order),
      published: getCheckbox(p.Published),
    };

    const success = await syncToConvex("research:upsert", data);
    console.log(`   ${success ? "✅" : "❌"} ${data.title}`);
  }
}

async function syncContributions() {
  const dbId = process.env.NOTION_CONTRIBUTIONS_DB;
  if (!dbId) return;

  console.log("📦 Syncing Contributions...");
  const pages = await fetchNotionDatabase(dbId);

  for (const page of pages) {
    const p = page.properties;
    const type = getSelect(p.Type) as "repo" | "npm";

    const data: any = {
      notionId: page.id,
      name: getTitle(p.Name),
      description: getText(p.Description),
      type,
      url: getUrl(p.URL),
      order: getNumber(p.Order),
      published: getCheckbox(p.Published),
    };

    if (type === "repo") {
      data.stars = getNumber(p.Stars);
      data.prs = getNumber(p.PRs);
      data.language = getText(p.Language) || undefined;
    } else {
      data.downloads = getText(p.Downloads) || undefined;
      data.version = getText(p.Version) || undefined;
    }

    const success = await syncToConvex("contributions:upsert", data);
    console.log(`   ${success ? "✅" : "❌"} ${data.name}`);
  }
}

async function syncAvailability() {
  const dbId = process.env.NOTION_AVAILABILITY_DB;
  if (!dbId) return;

  console.log("📦 Syncing Availability...");
  const pages = await fetchNotionDatabase(dbId);

  if (pages.length > 0) {
    const page = pages[0];
    const p = page.properties;

    const data = {
      notionId: page.id,
      isAvailable: getCheckbox(p.IsAvailable),
      status: getSelect(p.Status) as "Available" | "Limited" | "Booked",
      message: getText(p.Message) || undefined,
      calendlyUrl: getUrl(p.CalendlyURL) || undefined,
    };

    const success = await syncToConvex("availability:upsert", data);
    console.log(`   ${success ? "✅" : "❌"} Availability status`);
  }
}

async function fetchPageContent(pageId: string): Promise<string> {
  try {
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
    if (!response.ok) return "";

    // Convert blocks to markdown-ish content
    let content = "";
    for (const block of data.results || []) {
      const type = block.type;
      const blockData = block[type];

      if (type === "paragraph" && blockData?.rich_text) {
        content += blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "heading_1" && blockData?.rich_text) {
        content += "# " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "heading_2" && blockData?.rich_text) {
        content += "## " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "heading_3" && blockData?.rich_text) {
        content += "### " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "bulleted_list_item" && blockData?.rich_text) {
        content += "- " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n";
      } else if (type === "numbered_list_item" && blockData?.rich_text) {
        content += "1. " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n";
      } else if (type === "code" && blockData?.rich_text) {
        const lang = blockData.language || "";
        content += "```" + lang + "\n" + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n```\n\n";
      }
    }

    return content.trim();
  } catch {
    return "";
  }
}

async function syncBlog() {
  const dbId = process.env.NOTION_BLOG_DB;
  if (!dbId) return;

  console.log("📦 Syncing Blog...");
  const pages = await fetchNotionDatabase(dbId);

  for (const page of pages) {
    const p = page.properties;

    // Fetch page content
    const content = await fetchPageContent(page.id);

    const data = {
      notionId: page.id,
      title: getTitle(p.Name),
      slug: getText(p.Slug),
      date: getDate(p.Date) || new Date().toISOString().split("T")[0],
      tags: getMultiSelect(p.Tags),
      excerpt: getText(p.Excerpt),
      content: content || getText(p.Excerpt),
      coverImage: getUrl(p.CoverImage) || undefined,
      published: getCheckbox(p.Published),
    };

    const success = await syncToConvex("blog:upsert", data);
    console.log(`   ${success ? "✅" : "❌"} ${data.title}`);
  }
}

async function main() {
  console.log("\n🔄 Syncing Notion → Convex...\n");

  await syncProjects();
  await syncResearch();
  await syncContributions();
  await syncBlog();
  await syncAvailability();

  console.log("\n✅ Sync complete!\n");
}

main().catch(console.error);
