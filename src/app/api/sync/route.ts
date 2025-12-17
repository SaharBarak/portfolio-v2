import { NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Simple auth token to prevent unauthorized syncs
const SYNC_SECRET = process.env.SYNC_SECRET || "sync-portfolio-2024";

// Notion helpers
function getText(prop: any): string {
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text?.[0]?.plain_text || "";
}

function getTitle(prop: any): string {
  if (!prop || prop.type !== "title") return "";
  return prop.title?.[0]?.plain_text || "";
}

function getNumber(prop: any): number {
  if (!prop || prop.type !== "number") return 0;
  return prop.number || 0;
}

function getCheckbox(prop: any): boolean {
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox || false;
}

function getSelect(prop: any): string {
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name || "";
}

function getUrl(prop: any): string {
  if (!prop || prop.type !== "url") return "";
  return prop.url || "";
}

function getDate(prop: any): string {
  if (!prop || prop.type !== "date") return "";
  return prop.date?.start || "";
}

function getMultiSelect(prop: any): string[] {
  if (!prop || prop.type !== "multi_select") return [];
  return (prop.multi_select || []).map((item: any) => item.name);
}

async function fetchNotionDatabase(databaseId: string): Promise<any[]> {
  const pages: any[] = [];
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
    if (!response.ok) break;

    pages.push(...data.results);
    hasMore = data.has_more;
    startCursor = data.next_cursor;
  }

  return pages;
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

    let content = "";
    for (const block of data.results || []) {
      const type = block.type;
      const blockData = block[type];

      if (type === "paragraph" && blockData?.rich_text) {
        content += blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "heading_2" && blockData?.rich_text) {
        content += "## " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n\n";
      } else if (type === "bulleted_list_item" && blockData?.rich_text) {
        content += "- " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n";
      } else if (type === "numbered_list_item" && blockData?.rich_text) {
        content += "1. " + blockData.rich_text.map((t: any) => t.plain_text).join("") + "\n";
      }
    }

    return content.trim();
  } catch {
    return "";
  }
}

async function syncToConvex(functionName: string, data: any): Promise<boolean> {
  try {
    const response = await fetch(`${CONVEX_URL}/api/mutation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: functionName, args: data }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // Check auth
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, { synced: number; errors: number }> = {};

  // Sync Projects
  const projectsDbId = process.env.NOTION_PROJECTS_DB;
  if (projectsDbId) {
    const pages = await fetchNotionDatabase(projectsDbId);
    let synced = 0, errors = 0;

    for (const page of pages) {
      const p = page.properties;
      const success = await syncToConvex("projects:upsert", {
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
      });
      success ? synced++ : errors++;
    }
    results.projects = { synced, errors };
  }

  // Sync Research
  const researchDbId = process.env.NOTION_RESEARCH_DB;
  if (researchDbId) {
    const pages = await fetchNotionDatabase(researchDbId);
    let synced = 0, errors = 0;

    for (const page of pages) {
      const p = page.properties;
      let links = [], references = [];
      try {
        links = JSON.parse(getText(p.Links) || "[]");
        references = JSON.parse(getText(p.References) || "[]");
      } catch {}

      const success = await syncToConvex("research:upsert", {
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
      });
      success ? synced++ : errors++;
    }
    results.research = { synced, errors };
  }

  // Sync Blog
  const blogDbId = process.env.NOTION_BLOG_DB;
  if (blogDbId) {
    const pages = await fetchNotionDatabase(blogDbId);
    let synced = 0, errors = 0;

    for (const page of pages) {
      const p = page.properties;
      const content = await fetchPageContent(page.id);

      const success = await syncToConvex("blog:upsert", {
        notionId: page.id,
        title: getTitle(p.Name),
        slug: getText(p.Slug),
        date: getDate(p.Date) || new Date().toISOString().split("T")[0],
        tags: getMultiSelect(p.Tags),
        excerpt: getText(p.Excerpt),
        content: content || getText(p.Excerpt),
        coverImage: getUrl(p.CoverImage) || undefined,
        published: getCheckbox(p.Published),
      });
      success ? synced++ : errors++;
    }
    results.blog = { synced, errors };
  }

  // Sync Contributions
  const contributionsDbId = process.env.NOTION_CONTRIBUTIONS_DB;
  if (contributionsDbId) {
    const pages = await fetchNotionDatabase(contributionsDbId);
    let synced = 0, errors = 0;

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
      success ? synced++ : errors++;
    }
    results.contributions = { synced, errors };
  }

  // Sync Availability
  const availabilityDbId = process.env.NOTION_AVAILABILITY_DB;
  if (availabilityDbId) {
    const pages = await fetchNotionDatabase(availabilityDbId);
    if (pages.length > 0) {
      const page = pages[0];
      const p = page.properties;

      const success = await syncToConvex("availability:upsert", {
        notionId: page.id,
        isAvailable: getCheckbox(p.IsAvailable),
        status: getSelect(p.Status) as "Available" | "Limited" | "Booked",
        message: getText(p.Message) || undefined,
        calendlyUrl: getUrl(p.CalendlyURL) || undefined,
      });
      results.availability = { synced: success ? 1 : 0, errors: success ? 0 : 1 };
    }
  }

  return NextResponse.json({
    success: true,
    syncedAt: new Date().toISOString(),
    results,
  });
}

// Also support GET for easy browser/Notion button access
export async function GET(request: Request) {
  return POST(request);
}
