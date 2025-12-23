"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useBlogPosts } from "@/hooks/useContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommandBar from "@/components/blog/CommandBar";
import BlogThemeSwitcher from "@/components/blog/BlogThemeSwitcher";
import WelcomeSection from "@/components/blog/WelcomeSection";
import QuickFilterTabs, { FilterTab } from "@/components/blog/QuickFilterTabs";
import TopicCardsGrid from "@/components/blog/TopicCardsGrid";
import PopularPostsSection from "@/components/blog/PopularPostsSection";
import { PostListSkeleton } from "@/components/blog/BlogSkeleton";
import BlogCover from "@/components/blog/BlogCover";
import MobileBottomNav from "@/components/blog/MobileBottomNav";
import AuthorStatsCard from "@/components/blog/AuthorStatsCard";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
  views?: number;
}

function calculateReadingTime(excerpt: string): number {
  const wordsPerMinute = 200;
  const wordCount = excerpt.split(/\s+/).length * 8;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function PostRow({ post, index }: { post: BlogPost; index: number }) {
  const readingTime = calculateReadingTime(post.excerpt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/blog/${post.slug}`} className="blog-post-row group">
        <div className="blog-post-thumbnail">
          <BlogCover
            coverImage={post.coverImage}
            title={post.title}
            slug={post.slug}
            tags={post.tags}
            size="small"
          />
        </div>
        <div className="blog-post-content">
          <div className="blog-post-header">
            <span className="blog-post-date">{formatDate(post.date)}</span>
            <span className="blog-post-reading-time">{readingTime} min read</span>
          </div>
          <h3 className="blog-post-title">{post.title}</h3>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          <div className="blog-post-meta">
            {post.views && post.views > 0 && (
              <span className="blog-post-views">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {post.views.toLocaleString()}
              </span>
            )}
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="blog-post-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const readingTime = calculateReadingTime(post.excerpt);

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 hover:border-indigo-500/40 transition-all overflow-hidden"
      >
        {/* Featured cover image */}
        <div className="relative">
          <BlogCover
            coverImage={post.coverImage}
            title={post.title}
            slug={post.slug}
            tags={post.tags}
            size="large"
          />
          <div className="absolute top-4 left-4">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/80 backdrop-blur-sm text-white text-[11px] font-medium uppercase tracking-wider">
              Featured
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[var(--blog-text-muted)]">{readingTime} min read</span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>
            {post.title}
          </h2>
          <p className="text-[var(--blog-text-muted)] line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-[var(--blog-text-muted)]">
            <span>{formatDate(post.date)}</span>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function TagPill({ tag, count, isActive, onClick }: { tag: string; count: number; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
        isActive
          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          : "bg-white/[0.03] text-[var(--blog-text-muted)] border border-transparent hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <span>{tag}</span>
      <span className="opacity-50">{count}</span>
    </button>
  );
}

function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const subscribe = useMutation(api.blog.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await subscribe({ email, source: "blog" });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span>You're subscribed!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "var(--space-3)" }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="font-body"
        style={{
          flex: 1,
          padding: "var(--space-3) var(--space-4)",
          fontSize: "var(--text-sm)",
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid var(--blog-border)",
          borderRadius: "var(--radius-lg)",
          color: "white",
        }}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="font-body font-medium"
        style={{
          padding: "var(--space-3) var(--space-5)",
          fontSize: "var(--text-sm)",
          backgroundColor: "var(--current-text-bold)",
          color: "var(--background)",
          borderRadius: "var(--radius-lg)",
          transition: "opacity 0.2s ease",
          opacity: status === "loading" ? 0.5 : 1,
        }}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
    </form>
  );
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("latest");
  const convexPosts = useBlogPosts();
  const isLoading = convexPosts === undefined;

  const posts: BlogPost[] = useMemo(() => {
    if (!convexPosts) return [];
    return convexPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt || "",
      date: p.date || new Date().toISOString(),
      tags: p.tags || [],
      coverImage: p.coverImage || undefined,
      views: p.views || 0,
    }));
  }, [convexPosts]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);

  const allTags = useMemo(() => {
    return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  }, [tagCounts]);

  const filteredPosts = useMemo(() => {
    if (!activeTag) return posts;
    return posts.filter((post) => post.tags.includes(activeTag));
  }, [posts, activeTag]);

  const featuredPost = posts[0];
  const regularPosts = activeTag ? filteredPosts : posts.slice(1);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="blog-page-wrapper">
      <Header />
      <BlogThemeSwitcher />
      <main className="min-h-screen">
        {/* Compact container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <header className="blog-header">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="blog-header-title">Writing</h1>
                <p className="blog-header-subtitle">
                  Thoughts on engineering, AI, and building products.
                </p>
              </div>
              <div className="blog-stats">
                <span className="blog-stats-item">
                  {posts.length} articles
                </span>
                <span className="blog-stats-item">
                  {totalViews.toLocaleString()} reads
                </span>
              </div>
            </div>
          </header>

          {/* Welcome Section */}
          <WelcomeSection />

          {/* Command Bar Search */}
          <div className="py-6 border-b border-[var(--blog-border)]">
            <CommandBar
              posts={posts}
              tags={allTags}
              onTagSelect={setActiveTag}
            />
          </div>

          {/* Main Content */}
          <div className="py-8">
            {/* Two column layout for desktop */}
            <div className="blog-main-grid">
              {/* Main column */}
              <div className="blog-main-content">
                {/* Quick Filter Tabs */}
                <QuickFilterTabs activeTab={activeFilter} onTabChange={setActiveFilter} />

                {/* Featured Post */}
                {featuredPost && !activeTag && activeFilter === "latest" && (
                  <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10"
                  >
                    <FeaturedPost post={featuredPost} />
                  </motion.section>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    <button
                      onClick={() => setActiveTag(null)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        !activeTag
                          ? "bg-white/10 text-white"
                          : "text-[var(--blog-text-muted)] hover:text-white"
                      }`}
                    >
                      All
                    </button>
                    {allTags.map((tag) => (
                      <TagPill
                        key={tag}
                        tag={tag}
                        count={tagCounts[tag]}
                        isActive={activeTag === tag}
                        onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                      />
                    ))}
                  </div>
                )}

                {/* Posts List */}
                <AnimatePresence mode="wait">
                  <motion.section
                    key={activeTag || activeFilter || "all"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-medium text-[var(--blog-text-muted)] uppercase tracking-wider">
                        {activeTag ? `${activeTag}` : "All Articles"}
                      </h2>
                      <span className="text-xs text-[var(--blog-text-muted)]">
                        {regularPosts.length} {regularPosts.length === 1 ? "post" : "posts"}
                      </span>
                    </div>

                    {isLoading ? (
                      <PostListSkeleton count={5} />
                    ) : regularPosts.length > 0 ? (
                      <div className="blog-posts-list">
                        {regularPosts.map((post, index) => (
                          <PostRow key={post.slug} post={post} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-16 text-center">
                        <p className="text-[var(--blog-text-muted)]">No posts in this category yet.</p>
                        <button
                          onClick={() => setActiveTag(null)}
                          className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                          View all posts
                        </button>
                      </div>
                    )}
                  </motion.section>
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <aside className="blog-sidebar">
                <AuthorStatsCard />
                <PopularPostsSection />
                <TopicCardsGrid tagCounts={tagCounts} />
              </aside>
            </div>
          </div>

          {/* Newsletter Section */}
          <section
            style={{
              padding: "var(--space-16) 0",
              borderTop: "1px solid var(--blog-border)",
            }}
          >
            <div style={{ maxWidth: "28rem" }}>
              <p
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  letterSpacing: "var(--tracking-widest)",
                  color: "var(--blog-text-muted)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Newsletter
              </p>
              <h3
                className="font-heading font-semibold"
                style={{
                  fontSize: "var(--text-2xl)",
                  lineHeight: "var(--leading-tight)",
                  color: "white",
                  marginBottom: "var(--space-2)",
                }}
              >
                Subscribe
              </h3>
              <p
                className="font-body"
                style={{
                  fontSize: "var(--text-sm)",
                  lineHeight: "var(--leading-relaxed)",
                  color: "var(--blog-text-muted)",
                  marginBottom: "var(--space-6)",
                }}
              >
                Get new posts delivered to your inbox. No spam.
              </p>
              <NewsletterInline />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
