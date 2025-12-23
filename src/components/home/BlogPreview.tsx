"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useBlogPosts } from "@/hooks/useContent";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block p-6 rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all hover:shadow-lg"
      >
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
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
        <h3
          className="font-heading font-bold mb-2 group-hover:text-[#8b5cf6] transition-colors"
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.3,
            color: "var(--text-strong)",
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p
          className="mb-3 line-clamp-2"
          style={{
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          {post.excerpt}
        </p>

        {/* Date */}
        <time
          dateTime={post.date}
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-muted)",
          }}
        >
          {formattedDate}
        </time>
      </Link>
    </motion.article>
  );
}

export default function BlogPreview() {
  const convexPosts = useBlogPosts();

  // Map Convex data to component format, limit to 3 posts
  const posts: BlogPost[] = convexPosts
    ? convexPosts.slice(0, 3).map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        date: p.date || new Date().toISOString(),
        tags: p.tags || [],
      }))
    : [];

  // Don't render if no posts
  if (posts.length === 0) return null;

  return (
    <section
      id="blog-preview"
      className="relative"
      style={{ padding: "var(--space-32) var(--space-8)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="font-medium uppercase mb-3"
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.1em",
              color: "#8b5cf6",
            }}
          >
            Blog
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2
              className="font-heading font-black tracking-tight"
              style={{
                fontSize: "clamp(1.75rem, 5vw, var(--text-4xl))",
                lineHeight: "var(--leading-none)",
                color: "var(--text-strong)",
              }}
            >
              Latest Writing
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-[#8b5cf6] transition-colors flex items-center gap-1"
              style={{ color: "var(--text-muted)" }}
            >
              View all posts
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
