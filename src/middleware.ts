import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Only run on specific routes that need auth (blog comments)
    "/blog/:path*",
    // API routes
    "/api/:path*",
  ],
};
