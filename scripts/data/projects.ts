// Extracted from src/components/home/FeaturedWork.tsx

const projectsData = [
  {
    title: "Wessley AI",
    subtitle: "Virtual Garage",
    description: "Understand your car in 3D. Plan repairs, upgrades, and order parts with model-specific precision.",
    url: "https://wessley.ai/",
    logo: "/ventures/wessley-logo.svg",
    colors: {
      bg: "#00141E",
      accent: "#22E974",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
    order: 1,
  },
  {
    title: "Karen CLI",
    subtitle: "Layout Testing",
    description: "AI-powered layout regression testing. Detects visual issues and generates CSS fixes automatically.",
    url: "https://karencli.dev/",
    logo: "/ventures/karen-hair.svg",
    colors: {
      bg: "#0C0A09",
      accent: "#CE5D17",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
    order: 2,
  },
  {
    title: "The Peace Board",
    subtitle: "Decentralized Pledges",
    description: "A live map showing where people stand on peace. Turning pledges into visible signal by country.",
    url: "https://thepeaceboard.com/",
    logo: "/ventures/peaceboard-logo.svg",
    colors: {
      bg: "#0a0a0a",
      accent: "#FFE262",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.5)",
    },
    order: 3,
  },
  {
    title: "Two Circle Studios",
    subtitle: "Product Studio",
    description: "Build products end-to-end in a week. Freelance design, high-impact client work, rapid prototyping.",
    url: "https://twocirclestudios.com/",
    logo: "/ventures/twocircle-logo.svg",
    colors: {
      bg: "#FAF7F2",
      accent: "#FF6B35",
      text: "#1a1a1a",
      textMuted: "rgba(26,26,26,0.5)",
    },
    order: 4,
  },
];

module.exports = { projects: projectsData };
