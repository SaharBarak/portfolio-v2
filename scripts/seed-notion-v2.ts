/**
 * Seed Notion Databases v2 - Using Raw Fetch API
 *
 * Pushes extracted data from scripts/data/* to Notion databases
 * Run with: npx ts-node scripts/seed-notion-v2.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;

// Import extracted data
const { projects } = require("./data/projects");
const { research } = require("./data/research");
const { contributions } = require("./data/contributions");
const { availability } = require("./data/availability");

async function createPage(databaseId: string, properties: any): Promise<boolean> {
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

  return response.ok;
}

async function seedProjects() {
  const dbId = process.env.NOTION_PROJECTS_DB;
  if (!dbId) {
    console.log("   ⏭️  Skipping Projects (no database ID)");
    return;
  }

  console.log("📦 Seeding Projects...");

  for (const project of projects) {
    const success = await createPage(dbId, {
      Name: { title: [{ text: { content: project.title } }] },
      Subtitle: { rich_text: [{ text: { content: project.subtitle } }] },
      Description: { rich_text: [{ text: { content: project.description } }] },
      URL: { url: project.url },
      Logo: { rich_text: [{ text: { content: project.logo || "" } }] },
      BgColor: { rich_text: [{ text: { content: project.colors.bg } }] },
      AccentColor: { rich_text: [{ text: { content: project.colors.accent } }] },
      TextColor: { rich_text: [{ text: { content: project.colors.text } }] },
      TextMuted: { rich_text: [{ text: { content: project.colors.textMuted || "" } }] },
      Order: { number: project.order },
      Published: { checkbox: true },
    });

    console.log(`   ${success ? "✅" : "❌"} ${project.title}`);
  }
}

async function seedResearch() {
  const dbId = process.env.NOTION_RESEARCH_DB;
  if (!dbId) {
    console.log("   ⏭️  Skipping Research (no database ID)");
    return;
  }

  console.log("📦 Seeding Research...");

  for (const item of research) {
    const success = await createPage(dbId, {
      Name: { title: [{ text: { content: item.title } }] },
      Subtitle: { rich_text: [{ text: { content: item.subtitle } }] },
      Description: { rich_text: [{ text: { content: item.description } }] },
      Status: { select: { name: item.status } },
      Field: { select: { name: item.field } },
      Links: { rich_text: [{ text: { content: JSON.stringify(item.links) } }] },
      References: { rich_text: [{ text: { content: JSON.stringify(item.references) } }] },
      Order: { number: item.order },
      Published: { checkbox: true },
    });

    console.log(`   ${success ? "✅" : "❌"} ${item.title}`);
  }
}

async function seedContributions() {
  const dbId = process.env.NOTION_CONTRIBUTIONS_DB;
  if (!dbId) {
    console.log("   ⏭️  Skipping Contributions (no database ID)");
    return;
  }

  console.log("📦 Seeding Contributions...");

  for (const item of contributions) {
    const properties: any = {
      Name: { title: [{ text: { content: item.name } }] },
      Description: { rich_text: [{ text: { content: item.description } }] },
      Type: { select: { name: item.type } },
      URL: { url: item.url },
      Order: { number: item.order },
      Published: { checkbox: true },
    };

    if (item.type === "repo") {
      properties.Stars = { number: item.stars || 0 };
      properties.PRs = { number: item.prs || 0 };
      properties.Language = { rich_text: [{ text: { content: item.language || "" } }] };
    } else {
      properties.Downloads = { rich_text: [{ text: { content: item.downloads || "" } }] };
      properties.Version = { rich_text: [{ text: { content: item.version || "" } }] };
    }

    const success = await createPage(dbId, properties);
    console.log(`   ${success ? "✅" : "❌"} ${item.name}`);
  }
}

async function seedAvailability() {
  const dbId = process.env.NOTION_AVAILABILITY_DB;
  if (!dbId) {
    console.log("   ⏭️  Skipping Availability (no database ID)");
    return;
  }

  console.log("📦 Seeding Availability...");

  const success = await createPage(dbId, {
    Name: { title: [{ text: { content: "Current Status" } }] },
    IsAvailable: { checkbox: availability.isAvailable },
    Status: { select: { name: availability.status } },
    Message: { rich_text: availability.message ? [{ text: { content: availability.message } }] : [] },
    CalendlyURL: { url: availability.calendlyUrl },
  });

  console.log(`   ${success ? "✅" : "❌"} Availability status`);
}

async function main() {
  console.log("\n🌱 Seeding Notion databases with existing data...\n");

  await seedProjects();
  await seedResearch();
  await seedContributions();
  await seedAvailability();

  console.log("\n✅ Seeding complete!");
  console.log("   Check your Notion databases to verify the data.\n");
}

main().catch(console.error);
