// Central configuration for all external links used throughout the portfolio
// Update this file to change links across the entire project

export const LINKS = {
  // Personal/Professional Social Media
  social: {
    github: "https://github.com/saharbarak",
    linkedin: "https://linkedin.com/in/saharbarak",
    twitter: "https://twitter.com/saharbarak",
    instagram: "https://instagram.com/saharbarak",
    facebook: "https://facebook.com/saharbarak",
    discord: "https://discord.gg/YuqzGjBG",
    devto: "https://dev.to/saharbarak",
    substack: "https://substack.com/@saharbarak",
    huggingface: "https://huggingface.co/SaharBarak",
  },

  // Project Websites & Demos
  projects: {
    rent: {
      main: "https://rent.saharbarak.com",
      demo: "https://rent.saharbarak.com/demo",
      github: "https://github.com/saharbarak/rent"
    },
    cherry: {
      main: "https://cherry.saharbarak.com",
      github: "https://github.com/saharbarak/cherry"
    },
    peaceboard: {
      main: "https://thepeaceboard.com",
      demo: "https://thepeaceboard.com",
      github: "https://github.com/ThePeaceBoard",
      alternative: "https://www.thepeaceboard.com"
    },
    sync: {
      main: "https://sync.gov",
      demo: "https://sync.gov/demo",
      github: "https://github.com/saharbarak/sync"
    },
    mlExperiments: {
      github: "https://github.com/saharbarak/ml-experiments",
      notebook: "https://colab.research.google.com/drive/saharbarak"
    }
  },

  // Professional/Business Links
  professional: {
    calendly: {
      general: "https://calendly.com/saharbarak",
      thirtyMin: "https://calendly.com/sahar-h-barak/30min"
    },
    email: "mailto:sahar.h.barak@gmail.com",
    portfolio: "https://saharbarak.dev",
    resume: "https://your-resume-link.com"
  },

  // Support/Funding Platforms
  support: {
    patreon: "https://www.patreon.com/bePatron?u=111653068",
    buyMeACoffee: "https://www.buymeacoffee.com/saharbarak",
    kofi: "https://ko-fi.com/saharbarak",
    paypal: "https://paypal.me/saharbarak"
  },

  // External Resources & References
  external: {
    aboutIdeasNow: "https://aboutideasnow.com/about",
  }
};

// Helper functions to get specific link types
export const getSocialLink = (platform: keyof typeof LINKS.social) => LINKS.social[platform];
export const getProjectLink = (project: keyof typeof LINKS.projects, type: string = 'main') => {
  const proj = LINKS.projects[project];
  return proj?.[type as keyof typeof proj];
};
export const getProfessionalLink = (type: keyof typeof LINKS.professional) => LINKS.professional[type];
export const getSupportLink = (platform: keyof typeof LINKS.support) => LINKS.support[platform];

// Quick access to commonly used links
export const QUICK_LINKS = {
  githubProfile: LINKS.social.github,
  linkedinProfile: LINKS.social.linkedin,
  mainCalendly: LINKS.professional.calendly.thirtyMin,
  primaryEmail: LINKS.professional.email,
  mainProjects: [
    LINKS.projects.rent.main,
    LINKS.projects.peaceboard.main,
    LINKS.projects.sync.main
  ]
};

export default LINKS;
