"use client";

import { ConvexProvider as ConvexClientProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export function ConvexProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  const client = useMemo(() => {
    if (!convexUrl) return null;
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  if (!client) {
    // During static generation or when Convex URL is not set, render children without Convex
    return <>{children}</>;
  }

  return <ConvexClientProvider client={client}>{children}</ConvexClientProvider>;
}
