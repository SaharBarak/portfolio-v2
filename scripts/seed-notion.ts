/**
 * Seed Notion Databases
 *
 * Populates Notion databases with initial data from the pages
 * Run with: npx ts-node scripts/seed-notion.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const NOTION_API_KEY = process.env.NOTION_API_KEY;

if (!NOTION_API_KEY) {
  console.error("❌ Missing NOTION_API_KEY in .env.local");
  process.exit(1);
}

async function createPage(databaseId: string, properties: Record<string, any>) {
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
    console.error(`   ❌ Failed:`, data.message || data);
    return null;
  }
  return data;
}

// Helper to create rich_text property
function richText(content: string) {
  return { rich_text: [{ text: { content } }] };
}

// Helper to create title property
function title(content: string) {
  return { title: [{ text: { content } }] };
}

// Helper to create number property
function number(value: number) {
  return { number: value };
}

// Helper to create checkbox property
function checkbox(value: boolean) {
  return { checkbox: value };
}

// Helper to create select property
function select(name: string) {
  return { select: { name } };
}

// Helper to create multi_select property
function multiSelect(names: string[]) {
  return { multi_select: names.map((name) => ({ name })) };
}

// Helper to create url property
function url(value: string) {
  return { url: value || null };
}

async function seedAbout() {
  const dbId = process.env.NOTION_ABOUT_DB;
  if (!dbId) {
    console.log("⏭️  Skipping About (no NOTION_ABOUT_DB)");
    return;
  }

  console.log("📦 Seeding About...");

  const heroImages = [
    "/hero/1.jpg",
    "/hero/2.jpg",
    "/hero/3.jpg",
    "/hero/4.jpg",
    "/hero/5.jpg",
    "/hero/6.jpg",
  ];

  const stackGroups = [
    { label: "Languages", items: ["TypeScript", "Python", "JavaScript", "Go", "Rust", "SQL", "Bash", "C++"] },
    { label: "AI & ML", items: ["PyTorch", "TensorFlow", "JAX", "scikit-learn", "XGBoost", "Keras", "ONNX", "MLflow", "Hugging Face", "spaCy", "OpenCV", "YOLO", "Stable Diffusion", "Whisper"] },
    { label: "LLMs & RAG", items: ["Claude API", "OpenAI", "LangChain", "LlamaIndex", "Anthropic SDK", "CrewAI", "DSPy", "Pinecone", "Weaviate", "Chroma", "Milvus", "FAISS"] },
    { label: "Data & MLOps", items: ["Pandas", "NumPy", "Polars", "DVC", "Weights & Biases", "Ray", "Airflow", "Dagster"] },
    { label: "Frontend", items: ["React", "Next.js", "Vue", "Svelte", "Tailwind", "Framer Motion", "GSAP", "Three.js", "WebGL"] },
    { label: "Backend", items: ["Node.js", "FastAPI", "Django", "Flask", "Express", "NestJS", "tRPC", "GraphQL", "gRPC"] },
    { label: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Neo4j", "ClickHouse", "Convex", "Supabase", "Prisma"] },
    { label: "Infrastructure", items: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Pulumi", "Cloudflare", "Vercel", "GitHub Actions"] },
  ];

  const ventures = [
    { name: "Wessley AI", description: "3D car understanding", url: "https://wessley.ai" },
    { name: "Karen CLI", description: "layout testing", url: "https://karencli.dev" },
    { name: "The Peace Board", description: "decentralized peace pledges", url: "https://thepeaceboard.com" },
  ];

  const freelance = {
    name: "Two Circle Studios",
    description: "Full-stack web apps, AI integration, rapid prototyping. Building products end-to-end.",
    url: "https://twocirclestudios.com",
  };

  const socialLinks = {
    email: "sahar.h.barak@gmail.com",
    github: "https://github.com/saharbarak",
    linkedin: "https://linkedin.com/in/saharbarak",
    twitter: "https://twitter.com/saharbarak",
  };

  const result = await createPage(dbId, {
    Name: title("Hey, I'm Sahar"),
    Tagline: richText("Developer building things — freelancing and working on my own ventures."),
    Bio: richText("I'm a developer based in Israel. I build things — some for clients, some for myself. Right now I'm mostly doing freelance work while working on my own projects on the side."),
    BioSecondary: richText("I like working on AI stuff, web apps, and tools that help people coordinate better. Nothing fancy, just trying to build useful things."),
    HeroImages: richText(JSON.stringify(heroImages)),
    Ventures: richText(JSON.stringify(ventures)),
    Freelance: richText(JSON.stringify(freelance)),
    Research: richText("exploring identity systems, cryptographic reputation protocols, and ML for clean energy (white hydrogen detection)."),
    Stack: richText(JSON.stringify(stackGroups)),
    Hobbies: richText("Kitesurfing, yoga, playing oud, riding motorcycles, climbing, and chasing sunsets. I try to spend as much time outside as possible."),
    SocialLinks: richText(JSON.stringify(socialLinks)),
  });

  console.log(`   ${result ? "✅" : "❌"} About page`);
}

async function seedIdeas() {
  const dbId = process.env.NOTION_IDEAS_DB;
  if (!dbId) {
    console.log("⏭️  Skipping Ideas (no NOTION_IDEAS_DB)");
    return;
  }

  console.log("📦 Seeding Ideas...");

  const ideas = [
    {
      title: "Decentralized Identity Protocol",
      status: "Exploring",
      tags: ["Cryptography", "Identity", "Web3"],
      description: "A self-sovereign identity system using zero-knowledge proofs for privacy-preserving verification. Exploring integration with existing social graphs.",
      order: 1,
    },
    {
      title: "ML-Based White Hydrogen Detection",
      status: "Research",
      tags: ["ML", "Clean Energy", "Geology"],
      description: "Using satellite imagery and geological data to predict natural hydrogen deposits. Could accelerate the transition to clean energy.",
      order: 2,
    },
    {
      title: "Collaborative AI Agents",
      status: "Prototype",
      tags: ["LLM", "AI", "Agents"],
      description: "Multi-agent systems that can collaborate on complex tasks. Exploring hierarchical delegation and memory sharing patterns.",
      order: 3,
    },
    {
      title: "Reputation Primitives",
      status: "Concept",
      tags: ["Cryptography", "Social"],
      description: "Portable, verifiable reputation that travels with you across platforms. Privacy-first approach using commitment schemes.",
      order: 4,
    },
    {
      title: "Semantic Code Search",
      status: "Active",
      tags: ["LLM", "Dev Tools", "RAG"],
      description: "Find code by describing what it does, not just keyword matching. Using embeddings and AST analysis for better context.",
      order: 5,
    },
  ];

  for (const idea of ideas) {
    const result = await createPage(dbId, {
      Name: title(idea.title),
      Status: select(idea.status),
      Tags: multiSelect(idea.tags),
      Description: richText(idea.description),
      Order: number(idea.order),
      Published: checkbox(true),
    });
    console.log(`   ${result ? "✅" : "❌"} ${idea.title}`);
  }
}

async function seedNow() {
  const dbId = process.env.NOTION_NOW_DB;
  if (!dbId) {
    console.log("⏭️  Skipping Now (no NOTION_NOW_DB)");
    return;
  }

  console.log("📦 Seeding Now...");

  const nowItems = [
    // Building
    {
      section: "Building",
      title: "Wessley AI",
      description: "3D vehicle understanding platform for automotive industry",
      emoji: "🚗",
      url: "https://wessley.ai",
      order: 1,
    },
    {
      section: "Building",
      title: "Karen CLI",
      description: "Layout testing tool for developers",
      emoji: "🔧",
      url: "https://karencli.dev",
      order: 2,
    },
    {
      section: "Building",
      title: "The Peace Board",
      description: "Decentralized peace pledges on-chain",
      emoji: "☮️",
      url: "https://thepeaceboard.com",
      order: 3,
    },
    // Reading
    {
      section: "Reading",
      title: "The Art of Doing Science and Engineering",
      description: "Richard Hamming",
      emoji: "📚",
      order: 1,
    },
    {
      section: "Reading",
      title: "Designing Data-Intensive Applications",
      description: "Martin Kleppmann",
      emoji: "📚",
      order: 2,
    },
    // Focus
    {
      section: "Focus",
      title: "AI/ML Infrastructure",
      description: "Building scalable ML pipelines and model serving systems",
      emoji: "🧠",
      order: 1,
    },
    {
      section: "Focus",
      title: "Distributed Systems",
      description: "Deep dive into consensus algorithms and event sourcing",
      emoji: "🌐",
      order: 2,
    },
    // Learning
    {
      section: "Learning",
      title: "Rust",
      description: "Systems programming for high-performance applications",
      emoji: "🦀",
      order: 1,
    },
    {
      section: "Learning",
      title: "Cryptography",
      description: "Zero-knowledge proofs and commitment schemes",
      emoji: "🔐",
      order: 2,
    },
    // Listening
    {
      section: "Listening",
      title: "Lex Fridman Podcast",
      description: "Deep conversations with scientists and thinkers",
      emoji: "🎙️",
      url: "https://lexfridman.com/podcast",
      order: 1,
    },
    {
      section: "Listening",
      title: "Acquired",
      description: "Business history deep dives",
      emoji: "🎧",
      url: "https://acquired.fm",
      order: 2,
    },
  ];

  for (const item of nowItems) {
    const result = await createPage(dbId, {
      Name: title(item.title),
      Section: select(item.section),
      Description: richText(item.description || ""),
      Emoji: richText(item.emoji || ""),
      URL: url(item.url || ""),
      Order: number(item.order),
      Published: checkbox(true),
    });
    console.log(`   ${result ? "✅" : "❌"} ${item.title}`);
  }
}

async function seedAvailability() {
  const dbId = process.env.NOTION_AVAILABILITY_DB;
  if (!dbId) {
    console.log("⏭️  Skipping Availability (no NOTION_AVAILABILITY_DB)");
    return;
  }

  console.log("📦 Seeding Availability...");

  const result = await createPage(dbId, {
    Name: title("Current Availability"),
    IsAvailable: checkbox(true),
    Status: select("Available"),
    Message: richText("Currently taking on new freelance projects. Let's chat!"),
    CalendlyURL: url("https://calendly.com/saharbarak"),
  });

  console.log(`   ${result ? "✅" : "❌"} Availability status`);
}

async function main() {
  console.log("\n🌱 Seeding Notion databases...\n");

  await seedAbout();
  await seedIdeas();
  await seedNow();
  await seedAvailability();

  console.log("\n✅ Seeding complete!");
  console.log("   Run 'npm run notion:sync' to sync to Convex.\n");
}

main().catch(console.error);
