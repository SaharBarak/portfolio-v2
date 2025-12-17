"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-colors"
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
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
          <h2
            className="font-heading font-bold mb-2 group-hover:text-[#8b5cf6] transition-colors"
            style={{
              fontSize: "var(--text-xl)",
              lineHeight: 1.3,
              color: "var(--text-strong)",
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="mb-4 line-clamp-3"
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
        </div>
      </Link>
    </motion.article>
  );
}

export default function BlogPage() {
  const convexPosts = useBlogPosts();

  // Map Convex data to component format
  const posts: BlogPost[] = convexPosts
    ? convexPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        date: p.date || new Date().toISOString(),
        tags: p.tags || [],
        coverImage: p.coverImage || undefined,
      }))
    : [];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-[var(--space-8)]">
          {/* Page Header */}
          <motion.header
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
            <h1
              className="font-heading font-black tracking-tight mb-4"
              style={{
                fontSize: "clamp(2.5rem, 8vw, var(--text-6xl))",
                lineHeight: "var(--leading-none)",
                color: "var(--text-strong)",
              }}
            >
              Writing & Ideas
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--text-muted)",
              }}
            >
              Thoughts on engineering, research, and building things.
            </p>
          </motion.header>

          {/* Blog Grid */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-muted)",
                }}
              >
                No posts yet. Check back soon!
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
