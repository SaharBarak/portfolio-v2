/**
 * Check Notion Databases
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;

async function checkDatabase(name: string, dbId: string | undefined) {
  if (!dbId) {
    console.log(`${name}: No DB ID`);
    return;
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${dbId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({ page_size: 100 }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.log(`${name}: Error - ${data.message}`);
    return;
  }

  const count = data.results ? data.results.length : 0;
  console.log(`${name}: ${count} items`);
}

async function main() {
  console.log("📊 Checking Notion databases...\n");

  await checkDatabase("Projects", process.env.NOTION_PROJECTS_DB);
  await checkDatabase("Freelance", process.env.NOTION_FREELANCE_DB);
  await checkDatabase("Research", process.env.NOTION_RESEARCH_DB);
  await checkDatabase("Contributions", process.env.NOTION_CONTRIBUTIONS_DB);
  await checkDatabase("Blog", process.env.NOTION_BLOG_DB);
  await checkDatabase("Ideas", process.env.NOTION_IDEAS_DB);
  await checkDatabase("Now", process.env.NOTION_NOW_DB);
  await checkDatabase("About", process.env.NOTION_ABOUT_DB);
  await checkDatabase("Links", process.env.NOTION_LINKS_DB);
  await checkDatabase("Availability", process.env.NOTION_AVAILABILITY_DB);
}

main();
