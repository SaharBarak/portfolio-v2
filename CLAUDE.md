# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio website v2 - Next.js 15 app with WebGL animations, Framer Motion, Lenis smooth scrolling, and GSAP.

Features:
- Hero section with volumetric WebGL clouds (day/night themes)
- Day theme: Sky blue gradient with white clouds
- Night theme: Dark sky with stars, moon, and darker clouds
- /about, /ideas, /now page structure (aboutideasnow.com pattern)
- Design tokens for typography, colors, and radiuses

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with Hero + content
│   ├── about/page.tsx     # About page
│   ├── ideas/page.tsx     # Ideas page
│   ├── now/page.tsx       # Now page
│   ├── layout.tsx         # Root layout with providers
│   └── globals.css        # Design tokens & global styles
├── components/
│   ├── layout/            # Header, Footer
│   ├── hero/              # HeroSection, SkyBackground (WebGL)
│   └── ui/                # Shadcn UI components
├── contexts/              # ThemeContext, LenisContext
├── config/                # links.ts (centralized URLs)
├── hooks/                 # Custom hooks
└── lib/                   # Utilities (cn function)
```

## Design Tokens

Typography scale: 1.2 (Minor Third)
```css
--font-heading: 'Archivo', 'Space Grotesk', sans-serif;
--font-body: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
```

All colors use CSS variables for light/dark mode:
- `var(--background)`, `var(--foreground)`
- `var(--text-strong)`, `var(--text)`, `var(--text-muted)`
- `var(--card)`, `var(--card-border)`

## Key Conventions

- All styling uses design tokens from globals.css
- WebGL components use @react-three/fiber and @react-three/drei
- Theme toggle uses `data-theme` attribute + `.dark` class
- Animations: GSAP for complex, Framer Motion for declarative
- Lenis for smooth scrolling site-wide
- Shadcn for UI components (button, card, etc.)

## Important Files

- `src/components/hero/SkyBackground.tsx` - WebGL sky with clouds
- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/config/links.ts` - All external URLs centralized
