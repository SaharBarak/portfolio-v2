import type { Metadata, Viewport } from "next";
import { Archivo, Plus_Jakarta_Sans, Space_Grotesk, DM_Sans, Geist_Mono, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LenisProvider } from "@/contexts/LenisContext";
import { ConvexProvider } from "@/contexts/ConvexProvider";

// JSON-LD Structured Data for SEO/AEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://saharbarak.dev/#person",
      name: "Sahar Barak",
      url: "https://saharbarak.dev",
      image: "https://saharbarak.dev/logo512.png",
      jobTitle: "Software Engineer",
      description: "Software Engineer building at the intersection of AI, clean energy, and developer tools",
      sameAs: [
        "https://github.com/saharbarak",
        "https://linkedin.com/in/saharbarak",
        "https://twitter.com/saharbarak",
        "https://huggingface.co/SaharBarak",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Full-Stack Development",
        "Clean Energy Technology",
        "Developer Tools",
        "React",
        "Next.js",
        "TypeScript",
        "Python",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://saharbarak.dev/#website",
      url: "https://saharbarak.dev",
      name: "Sahar Barak | Software Engineer",
      description: "Portfolio website of Sahar Barak - Software Engineer building at the intersection of AI, clean energy, and developer tools",
      publisher: { "@id": "https://saharbarak.dev/#person" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://saharbarak.dev/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://saharbarak.dev/#profilepage",
      url: "https://saharbarak.dev",
      name: "Sahar Barak Portfolio",
      mainEntity: { "@id": "https://saharbarak.dev/#person" },
    },
  ],
};

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Blog-specific fonts
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Sahar Barak | Software Engineer",
    template: "%s | Sahar Barak",
  },
  description: "Software Engineer building at the intersection of AI, clean energy, and developer tools. Full-stack developer specializing in React, Next.js, TypeScript, and Python.",
  metadataBase: new URL("https://saharbarak.dev"),
  alternates: {
    canonical: "https://saharbarak.dev",
  },
  keywords: [
    "Sahar Barak",
    "Software Engineer",
    "Full Stack Developer",
    "AI Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Python",
    "Machine Learning",
    "Clean Energy",
    "Developer Tools",
    "Web Development",
    "Portfolio",
  ],
  authors: [{ name: "Sahar Barak", url: "https://saharbarak.dev" }],
  creator: "Sahar Barak",
  publisher: "Sahar Barak",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo196.png", type: "image/png", sizes: "196x196" },
    ],
    apple: [{ url: "/logo196.png", sizes: "196x196" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saharbarak.dev",
    siteName: "Sahar Barak",
    title: "Sahar Barak | Software Engineer",
    description: "Software Engineer building at the intersection of AI, clean energy, and developer tools. Full-stack developer specializing in React, Next.js, TypeScript, and Python.",
    images: [
      {
        url: "/logo512.png",
        width: 512,
        height: 512,
        alt: "Sahar Barak - Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@saharbarak",
    creator: "@saharbarak",
    title: "Sahar Barak | Software Engineer",
    description: "Software Engineer building at the intersection of AI, clean energy, and developer tools.",
    images: ["/logo512.png"],
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${dmSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* JSON-LD Structured Data for SEO/AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#a78bfa",
              colorBackground: "#0a0a0c",
              colorText: "#e4e4e7",
              colorTextSecondary: "#71717a",
              colorInputBackground: "#18181b",
              colorInputText: "#e4e4e7",
              colorDanger: "#ef4444",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-body)",
            },
            elements: {
              rootBox: {
                fontFamily: "var(--font-body)",
              },
              modalBackdrop: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                backdropFilter: "blur(4px)",
              },
              modalContent: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              card: {
                backgroundColor: "#0a0a0c",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                borderRadius: "1rem",
                margin: "auto",
              },
              headerTitle: {
                fontFamily: "var(--font-heading)",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#fafafa",
              },
              headerSubtitle: {
                color: "#71717a",
                fontSize: "0.875rem",
              },
              socialButtonsBlockButton: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "0.625rem",
                padding: "0.75rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                },
              },
              socialButtonsIconButton: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "0.625rem",
                width: "3rem",
                height: "3rem",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
              },
              socialButtonsIconButton__github: {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                "& svg path": {
                  fill: "#ffffff",
                },
              },
              socialButtonsIconButton__notion: {
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                "& svg path": {
                  fill: "#ffffff",
                },
              },
              socialButtonsProviderIcon: {
                filter: "brightness(0) invert(1)",
              },
              socialButtonsProviderIcon__github: {
                filter: "brightness(0) invert(1)",
              },
              socialButtonsProviderIcon__notion: {
                filter: "brightness(0) invert(1)",
              },
              dividerLine: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
              dividerText: {
                color: "#52525b",
                fontSize: "0.75rem",
              },
              formFieldLabel: {
                color: "#a1a1aa",
                fontSize: "0.875rem",
                fontWeight: "500",
              },
              formFieldInput: {
                backgroundColor: "#18181b",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "0.5rem",
                color: "#fafafa",
                "&:focus": {
                  borderColor: "#a78bfa",
                  boxShadow: "0 0 0 2px rgba(167, 139, 250, 0.2)",
                },
              },
              formButtonPrimary: {
                backgroundColor: "#a78bfa",
                borderRadius: "0.5rem",
                fontWeight: "600",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#8b5cf6",
                },
              },
              footerActionLink: {
                color: "#a78bfa",
                "&:hover": {
                  color: "#c4b5fd",
                },
              },
              footer: {
                display: "none",
              },
              modalCloseButton: {
                color: "#71717a",
                "&:hover": {
                  color: "#fafafa",
                },
              },
              identityPreviewEditButton: {
                color: "#a78bfa",
              },
              formFieldSuccessText: {
                color: "#22c55e",
              },
              alert: {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "0.5rem",
              },
            },
            layout: {
              socialButtonsPlacement: "top",
              socialButtonsVariant: "iconButton",
              showOptionalFields: false,
              helpPageUrl: undefined,
              privacyPageUrl: undefined,
              termsPageUrl: undefined,
            },
          }}
          afterSignOutUrl="/"
          localization={{
            signIn: {
              start: {
                title: "Welcome back",
                subtitle: "Sign in to continue",
              },
            },
            signUp: {
              start: {
                title: "Create account",
                subtitle: "Join the community",
              },
            },
          }}
        >
          <ConvexProvider>
            <ThemeProvider>
              <LenisProvider>
                {children}
              </LenisProvider>
            </ThemeProvider>
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
