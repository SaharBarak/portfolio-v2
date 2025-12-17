// Extracted from src/components/home/OpenSourceCode.tsx

const contributionsData = [
  {
    name: "karen-cli",
    description: "CLI for running layout regression checks with AI-powered fixes",
    type: "repo" as const,
    url: "https://github.com/saharbarak/karen-cli",
    stars: 42,
    prs: 8,
    language: "TypeScript",
    order: 1,
  },
  {
    name: "geoh2-ai",
    description: "Geospatial ML for white hydrogen seep detection",
    type: "repo" as const,
    url: "https://github.com/SaharBarak/geoh2-ai",
    stars: 18,
    prs: 3,
    language: "Python",
    order: 2,
  },
  {
    name: "@anthropic-ai/claude-code",
    description: "Contributor - CLI tool for Claude AI assistance",
    type: "npm" as const,
    url: "https://www.npmjs.com/package/@anthropic-ai/claude-code",
    downloads: "50k+/week",
    version: "1.0.0",
    order: 3,
  },
  {
    name: "sel-did",
    description: "Self-Evident Layer DID - Portable decentralized identity",
    type: "repo" as const,
    url: "https://github.com/SaharBarak/sel-did",
    stars: 24,
    prs: 5,
    language: "Rust",
    order: 4,
  },
  {
    name: "karen-cli",
    description: "Layout regression testing CLI with AI integration",
    type: "npm" as const,
    url: "https://www.npmjs.com/package/karen-cli",
    downloads: "2.1k/week",
    version: "0.4.2",
    order: 5,
  },
  {
    name: "gossip-protocol",
    description: "Abuse-resistant reputation verification protocol",
    type: "repo" as const,
    url: "https://github.com/SaharBarak/gossip-protocol",
    stars: 31,
    prs: 12,
    language: "Go",
    order: 6,
  },
];

module.exports = { contributions: contributionsData };
