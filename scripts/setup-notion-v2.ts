/**
 * Setup Notion Databases v2 - Using Raw Fetch API
 *
 * Creates all 9 databases in Notion with proper schemas
 * Run with: npx ts-node scripts/setup-notion-v2.ts
 */

import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;

if (!PARENT_PAGE_ID || !NOTION_API_KEY) {
  console.error("❌ Missing NOTION_API_KEY or NOTION_PARENT_PAGE_ID in .env.local");
  process.exit(1);
}

interface DatabaseConfig {
  name: string;
  envKey: string;
  icon: string;
  properties: Record<string, any>;
}

const databases: DatabaseConfig[] = [
  {
    name: "Projects",
    envKey: "NOTION_PROJECTS_DB",
    icon: "🚀",
    properties: {
      Name: { title: {} },
      Subtitle: { rich_text: {} },
      Description: { rich_text: {} },
      URL: { url: {} },
      Logo: { rich_text: {} },
      BgColor: { rich_text: {} },
      AccentColor: { rich_text: {} },
      TextColor: { rich_text: {} },
      TextMuted: { rich_text: {} },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Freelance",
    envKey: "NOTION_FREELANCE_DB",
    icon: "💼",
    properties: {
      Name: { title: {} },
      Client: { rich_text: {} },
      Description: { rich_text: {} },
      URL: { url: {} },
      Logo: { rich_text: {} },
      BgColor: { rich_text: {} },
      AccentColor: { rich_text: {} },
      TextColor: { rich_text: {} },
      Testimonial: { rich_text: {} },
      Tags: { multi_select: { options: [] } },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Research",
    envKey: "NOTION_RESEARCH_DB",
    icon: "🔬",
    properties: {
      Name: { title: {} },
      Subtitle: { rich_text: {} },
      Description: { rich_text: {} },
      Status: {
        select: {
          options: [
            { name: "research", color: "blue" },
            { name: "active", color: "green" },
            { name: "concept", color: "purple" },
          ],
        },
      },
      Field: {
        select: {
          options: [
            { name: "ML", color: "orange" },
            { name: "Blockchain", color: "blue" },
            { name: "Cryptography", color: "pink" },
            { name: "Identity", color: "purple" },
            { name: "LLM", color: "green" },
            { name: "Clean Energy", color: "default" },
          ],
        },
      },
      Links: { rich_text: {} },
      References: { rich_text: {} },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Contributions",
    envKey: "NOTION_CONTRIBUTIONS_DB",
    icon: "🛠️",
    properties: {
      Name: { title: {} },
      Description: { rich_text: {} },
      Type: {
        select: {
          options: [
            { name: "repo", color: "gray" },
            { name: "npm", color: "red" },
          ],
        },
      },
      URL: { url: {} },
      Stars: { number: {} },
      PRs: { number: {} },
      Language: { rich_text: {} },
      Downloads: { rich_text: {} },
      Version: { rich_text: {} },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Blog",
    envKey: "NOTION_BLOG_DB",
    icon: "📝",
    properties: {
      Name: { title: {} },
      Slug: { rich_text: {} },
      Date: { date: {} },
      Tags: { multi_select: { options: [] } },
      Excerpt: { rich_text: {} },
      CoverImage: { url: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Ideas",
    envKey: "NOTION_IDEAS_DB",
    icon: "💡",
    properties: {
      Name: { title: {} },
      Status: {
        select: {
          options: [
            { name: "Concept", color: "gray" },
            { name: "Prototype", color: "yellow" },
            { name: "Active", color: "green" },
            { name: "Exploring", color: "blue" },
            { name: "Vision", color: "purple" },
          ],
        },
      },
      Tags: { multi_select: { options: [] } },
      Description: { rich_text: {} },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "Now",
    envKey: "NOTION_NOW_DB",
    icon: "📍",
    properties: {
      Name: { title: {} },
      Section: {
        select: {
          options: [
            { name: "Building", color: "blue" },
            { name: "Reading", color: "yellow" },
            { name: "Focus", color: "green" },
            { name: "Learning", color: "purple" },
            { name: "Listening", color: "pink" },
          ],
        },
      },
      Description: { rich_text: {} },
      Emoji: { rich_text: {} },
      URL: { url: {} },
      Order: { number: {} },
      Published: { checkbox: {} },
    },
  },
  {
    name: "About",
    envKey: "NOTION_ABOUT_DB",
    icon: "👤",
    properties: {
      Name: { title: {} },
      Tagline: { rich_text: {} },
      Bio: { rich_text: {} },
      BioSecondary: { rich_text: {} },
      HeroImages: { rich_text: {} },
      Ventures: { rich_text: {} },
      Freelance: { rich_text: {} },
      Research: { rich_text: {} },
      Stack: { rich_text: {} },
      Hobbies: { rich_text: {} },
      SocialLinks: { rich_text: {} },
    },
  },
  {
    name: "Links",
    envKey: "NOTION_LINKS_DB",
    icon: "🔗",
    properties: {
      Name: { title: {} },
      Category: {
        select: {
          options: [
            { name: "social", color: "blue" },
            { name: "professional", color: "green" },
            { name: "support", color: "yellow" },
            { name: "external", color: "gray" },
            { name: "projects", color: "purple" },
          ],
        },
      },
      URL: { url: {} },
      Label: { rich_text: {} },
    },
  },
  {
    name: "Availability",
    envKey: "NOTION_AVAILABILITY_DB",
    icon: "🟢",
    properties: {
      Name: { title: {} },
      IsAvailable: { checkbox: {} },
      Status: {
        select: {
          options: [
            { name: "Available", color: "green" },
            { name: "Limited", color: "yellow" },
            { name: "Booked", color: "red" },
          ],
        },
      },
      Message: { rich_text: {} },
      CalendlyURL: { url: {} },
    },
  },
];

async function archiveOldDatabases() {
  const oldDbIds = [
    process.env.NOTION_PROJECTS_DB,
    process.env.NOTION_FREELANCE_DB,
    process.env.NOTION_RESEARCH_DB,
    process.env.NOTION_CONTRIBUTIONS_DB,
    process.env.NOTION_BLOG_DB,
    process.env.NOTION_IDEAS_DB,
    process.env.NOTION_NOW_DB,
    process.env.NOTION_LINKS_DB,
    process.env.NOTION_AVAILABILITY_DB,
  ].filter(Boolean);

  if (oldDbIds.length === 0) return;

  console.log("🗑️  Archiving old databases...\n");

  for (const dbId of oldDbIds) {
    try {
      const response = await fetch(`https://api.notion.com/v1/blocks/${dbId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
        },
      });
      if (response.ok) {
        console.log(`   ✅ Archived: ${dbId}`);
      } else {
        console.log(`   ⚠️  Could not archive ${dbId}`);
      }
    } catch {
      console.log(`   ⚠️  Could not archive ${dbId}`);
    }
  }
}

async function createDatabase(config: DatabaseConfig): Promise<string | null> {
  console.log(`📦 Creating ${config.name} database...`);

  const response = await fetch("https://api.notion.com/v1/databases", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { type: "page_id", page_id: PARENT_PAGE_ID },
      icon: { emoji: config.icon },
      title: [{ text: { content: config.name } }],
      properties: config.properties,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`   ❌ Failed: ${data.message || "Unknown error"}`);
    return null;
  }

  const propCount = data.properties ? Object.keys(data.properties).length : 0;
  console.log(`   ✅ Created: ${data.id} (${propCount} properties)`);
  return data.id;
}

async function main() {
  console.log("\n🚀 Setting up Notion databases (v2 - Raw API)...\n");

  // Archive old databases first
  await archiveOldDatabases();

  console.log("\n📚 Creating new databases...\n");

  const envUpdates: string[] = [];

  for (const db of databases) {
    const id = await createDatabase(db);
    if (id) {
      envUpdates.push(`${db.envKey}=${id}`);
    }
  }

  // Update .env.local
  console.log("\n📝 Updating .env.local...\n");

  const envPath = path.join(process.cwd(), ".env.local");
  let envContent = fs.readFileSync(envPath, "utf-8");

  for (const update of envUpdates) {
    const [key, value] = update.split("=");
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
    console.log(`   ${key}=${value}`);
  }

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ All databases created with full schemas!");
  console.log("   Run 'npm run notion:seed' to populate with data.\n");
}

main().catch(console.error);
