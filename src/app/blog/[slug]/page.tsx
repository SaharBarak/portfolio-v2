"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBlogPost } from "@/hooks/useContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const post = useBlogPost(slug);

  // Loading state
  if (post === undefined) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-[var(--space-8)]">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-[var(--card)] rounded w-3/4" />
              <div className="h-4 bg-[var(--card)] rounded w-1/4" />
              <div className="h-64 bg-[var(--card)] rounded mt-8" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not found
  if (post === null) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-[var(--space-8)] text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1
                className="font-heading font-bold mb-4"
                style={{
                  fontSize: "var(--text-4xl)",
                  color: "var(--text-strong)",
                }}
              >
                Post Not Found
              </h1>
              <p
                className="mb-8"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-muted)",
                }}
              >
                The blog post you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "#ffffff",
                }}
              >
                ← Back to Blog
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-[var(--space-8)]">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:text-[#8b5cf6] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              ← Back to Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(139, 92, 246, 0.15)",
                      color: "#8b5cf6",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1
              className="font-heading font-black tracking-tight mb-4"
              style={{
                fontSize: "clamp(2rem, 6vw, var(--text-5xl))",
                lineHeight: 1.1,
                color: "var(--text-strong)",
              }}
            >
              {post.title}
            </h1>

            {/* Date */}
            {formattedDate && (
              <time
                dateTime={post.date || ""}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-muted)",
                }}
              >
                {formattedDate}
              </time>
            )}
          </motion.header>

          {/* Cover Image */}
          {post.coverImage && (
            <motion.div
              className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className="prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              fontSize: "var(--text-base)",
              lineHeight: 1.8,
              color: "var(--text)",
            }}
          >
            {/* Blog content will come from Notion page body */}
            {post.excerpt && (
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {post.excerpt}
              </p>
            )}
            <p className="mt-8 text-center" style={{ color: "var(--text-muted)" }}>
              Full content coming soon...
            </p>
          </motion.div>
        </article>
      </main>
      <Footer />
    </>
  );
}
