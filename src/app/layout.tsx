import type { Metadata } from "next";
import { Archivo, Plus_Jakarta_Sans, Space_Grotesk, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LenisProvider } from "@/contexts/LenisContext";
import { ConvexProvider } from "@/contexts/ConvexProvider";

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

export const metadata: Metadata = {
  title: "Sahar Barak | Software Engineer",
  description: "Software Engineer building at the intersection of AI, clean energy, and developer tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ConvexProvider>
          <ThemeProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </ThemeProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
