"use client";

import { use, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBlogPosts } from "@/hooks/useContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogThemeSwitcher from "@/components/blog/BlogThemeSwitcher";
import { PostListSkeleton } from "@/components/blog/BlogSkeleton";

interface TopicPageProps {
  params: Promise<{ tag: string }>;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
  views?: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calculateReadingTime(excerpt: string): number {
  const wordsPerMinute = 200;
  const wordCount = excerpt.split(/\s+/).length * 8;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const readingTime = calculateReadingTime(post.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/blog/${post.slug}`} className="topic-post-card group">
        {post.coverImage && (
          <div className="topic-post-image">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={200}
              className="topic-post-img"
            />
          </div>
        )}
        <div className="topic-post-content">
          <div className="topic-post-meta">
            <span>{formatDate(post.date)}</span>
            <span className="topic-post-dot" />
            <span>{readingTime} min read</span>
            {post.views && post.views > 0 && (
              <>
                <span className="topic-post-dot" />
                <span className="topic-post-views">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {post.views.toLocaleString()}
                </span>
              </>
            )}
          </div>
          <h2 className="topic-post-title">{post.title}</h2>
          <p className="topic-post-excerpt">{post.excerpt}</p>
          <div className="topic-post-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="topic-post-tag">{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// Topic descriptions for SEO and display
const TOPIC_DESCRIPTIONS: Record<string, string> = {
  engineering: "Deep dives into software engineering practices, architecture patterns, and coding best practices.",
  ai: "Exploring artificial intelligence, machine learning, and the future of intelligent systems.",
  product: "Insights on product development, user experience, and building products people love.",
  design: "Thoughts on design systems, visual aesthetics, and creating beautiful interfaces.",
  career: "Career growth, professional development, and lessons learned in tech.",
  default: "Articles and thoughts on technology, engineering, and building products.",
};

export default function TopicPage({ params }: TopicPageProps) {
  const { tag } = use(params);
  const decodedTag = decodeURIComponent(tag);
  const convexPosts = useBlogPosts();
  const isLoading = convexPosts === undefined;

  const posts: BlogPost[] = useMemo(() => {
    if (!convexPosts) return [];
    return convexPosts
      .filter((p) => p.tags?.some((t) => t.toLowerCase() === decodedTag.toLowerCase()))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        date: p.date || new Date().toISOString(),
        tags: p.tags || [],
        coverImage: p.coverImage || undefined,
        views: p.views || 0,
      }));
  }, [convexPosts, decodedTag]);

  // Get related tags from the posts
  const relatedTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((t) => {
        if (t.toLowerCase() !== decodedTag.toLowerCase()) {
          tagCounts[t] = (tagCounts[t] || 0) + 1;
        }
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([t]) => t);
  }, [posts, decodedTag]);

  const description = TOPIC_DESCRIPTIONS[decodedTag.toLowerCase()] || TOPIC_DESCRIPTIONS.default;

  return (
    <div className="blog-page-wrapper">
      <Header />
      <BlogThemeSwitcher />
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-neutral-500 hover:text-purple-400 transition-colors group"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="group-hover:-translate-x-1 transition-transform"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </motion.div>

          {/* Topic Header */}
          <motion.header
            className="topic-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="topic-icon-large">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h1 className="topic-page-title">{decodedTag}</h1>
            <p className="topic-page-description">{description}</p>
            <div className="topic-page-stats">
              <span>{posts.length} article{posts.length !== 1 ? "s" : ""}</span>
            </div>
          </motion.header>

          {/* Related Topics */}
          {relatedTags.length > 0 && (
            <motion.section
              className="topic-related"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="topic-related-title">Related Topics</h3>
              <div className="topic-related-tags">
                {relatedTags.map((t) => (
                  <Link key={t} href={`/blog/topic/${t.toLowerCase()}`} className="topic-related-tag">
                    {t}
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Posts Grid */}
          <section className="topic-posts">
            {isLoading ? (
              <PostListSkeleton count={4} />
            ) : posts.length > 0 ? (
              <div className="topic-posts-grid">
                {posts.map((post, index) => (
                  <PostCard key={post.slug} post={post} index={index} />
                ))}
              </div>
            ) : (
              <div className="topic-empty">
                <p>No articles found in this topic yet.</p>
                <Link href="/blog" className="topic-empty-link">
                  Browse all articles
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
