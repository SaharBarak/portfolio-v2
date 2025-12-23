// Extracted from src/components/home/ResearchContributions.tsx

const researchData = [
  {
    title: "White Hydrogen Detection",
    subtitle: "Geospatial ML for Natural Hydrogen Discovery",
    description: "Applying satellite imagery analysis and machine learning to identify naturally occurring white hydrogen seeps—a potentially game-changing clean energy source. Research focuses on spectral signatures, geological correlates, and scalable detection pipelines.",
    status: "research" as const,
    field: "Clean Energy",
    references: [
      "Zgonnik, V. (2020). The occurrence and geoscience of natural hydrogen",
      "Prinzhofer, A. et al. (2018). Discovery of large hydrogen seep in Mali"
    ],
    links: [
      { label: "Code", url: "https://github.com/SaharBarak" },
      { label: "Draft", url: "#" },
      { label: "Article", url: "https://linkedin.com/in/saharbarak" },
    ],
    order: 1,
  },
  {
    title: "Gossip Verification Protocol",
    subtitle: "Abuse-Resistant Reputation from Human Signals",
    description: "A cryptographic protocol for transforming informal human signals—reviews, warnings, endorsements—into verifiable, sybil-resistant reputation scores. Designed for rental markets, hiring, and trust networks where traditional verification fails.",
    status: "active" as const,
    field: "Cryptography",
    references: [
      "Resnick, P. et al. (2000). Reputation Systems",
      "Kamvar, S. et al. (2003). The EigenTrust Algorithm"
    ],
    links: [
      { label: "Spec", url: "https://github.com/SaharBarak" },
      { label: "Preprint", url: "#" },
      { label: "Thread", url: "https://twitter.com/SaharBarak" },
    ],
    order: 2,
  },
  {
    title: "Massive Context Tree Hashing",
    subtitle: "Composable Fingerprints for Large Histories",
    description: "Novel hashing scheme for representing large conversation histories, identity graphs, and document trees as compact, composable fingerprints. Enables verification and selective disclosure without transmitting full context.",
    status: "concept" as const,
    field: "LLM",
    references: [
      "Merkle, R. (1987). A Digital Signature Based on a Conventional Encryption Function",
      "Benet, J. (2014). IPFS - Content Addressed, Versioned, P2P File System"
    ],
    links: [
      { label: "Explainer", url: "https://dev.to/saharbarak" },
      { label: "RFC", url: "https://github.com/SaharBarak" },
    ],
    order: 3,
  },
  {
    title: "Social Digital Signature (SDS)",
    subtitle: "Graph-Based Identity Authentication",
    description: "Authentication mechanism derived from the unique structure of a user's social and data graph. Provides passwordless login and strong anti-sybil guarantees without relying on centralized identity providers or biometrics.",
    status: "research" as const,
    field: "Identity",
    references: [
      "Naor, M. (1996). Verification of a Human in the Loop",
      "Douceur, J. (2002). The Sybil Attack"
    ],
    links: [
      { label: "Paper", url: "https://arxiv.org" },
      { label: "Model", url: "https://huggingface.co/SaharBarak" },
      { label: "Demo", url: "#" },
    ],
    order: 4,
  },
  {
    title: "SEL-DID",
    subtitle: "Self-Evident Layer Decentralized Identifier",
    description: "A portable identity standard combining cryptographic proofs with social graph attestations. Your identity travels with you across platforms, strengthened by cross-platform behavioral consistency rather than any single authority.",
    status: "active" as const,
    field: "Blockchain",
    references: [
      "W3C DID Core Specification (2022)",
      "Allen, C. (2016). The Path to Self-Sovereign Identity"
    ],
    links: [
      { label: "Repo", url: "https://github.com/SaharBarak" },
      { label: "Whitepaper", url: "#" },
      { label: "Demo", url: "#" },
    ],
    order: 5,
  },
];

module.exports = { research: researchData };
