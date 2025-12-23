"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogCover from "@/components/blog/BlogCover";
import { PostListSkeleton } from "@/components/blog/BlogSkeleton";
import MobileBottomNav from "@/components/blog/MobileBottomNav";

interface BookmarkedPost {
  _id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="reading-list-empty"
    >
      <div className="reading-list-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2>Your reading list is empty</h2>
      <p>Save articles you want to read later by clicking the bookmark icon on any post.</p>
      <Link href="/blog" className="reading-list-browse-btn">
        Browse articles
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  );
}

function ReadingListItem({
  post,
  index,
  onRemove
}: {
  post: BookmarkedPost;
  index: number;
  onRemove: (slug: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="reading-list-item"
    >
      <Link href={`/blog/${post.slug}`} className="reading-list-item-link">
        <div className="reading-list-item-cover">
          <BlogCover
            coverImage={post.coverImage}
            title={post.title}
            slug={post.slug}
            tags={post.tags}
            size="small"
          />
        </div>
        <div className="reading-list-item-content">
          <div className="reading-list-item-meta">
            <span className="reading-list-item-date">{formatDate(post.date)}</span>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="reading-list-item-tag">{tag}</span>
            ))}
          </div>
          <h3 className="reading-list-item-title">{post.title}</h3>
          <p className="reading-list-item-excerpt">{post.excerpt}</p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(post.slug);
        }}
        className="reading-list-remove-btn"
        title="Remove from reading list"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </motion.article>
  );
}

export default function ReadingListPage() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("blog-bookmarks") || "[]");
    setBookmarkedSlugs(bookmarks);
    setIsLoading(false);
  }, []);

  // Fetch post details from Convex
  const posts = useQuery(
    api.blog.getBySlugList,
    bookmarkedSlugs.length > 0 ? { slugs: bookmarkedSlugs } : "skip"
  );

  const handleRemove = (slug: string) => {
    const updated = bookmarkedSlugs.filter((s) => s !== slug);
    setBookmarkedSlugs(updated);
    localStorage.setItem("blog-bookmarks", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setBookmarkedSlugs([]);
    localStorage.setItem("blog-bookmarks", JSON.stringify([]));
  };

  // Sort posts to match the order in bookmarkedSlugs (most recently added first)
  const sortedPosts = posts
    ? [...posts].sort((a, b) => {
        const indexA = bookmarkedSlugs.indexOf(a.slug);
        const indexB = bookmarkedSlugs.indexOf(b.slug);
        return indexB - indexA; // Reverse order (newest first)
      })
    : [];

  return (
    <div className="blog-page-wrapper">
      <Header />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="reading-list-header"
          >
            <div className="reading-list-header-top">
              <Link href="/blog" className="reading-list-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>
            <div className="reading-list-header-main">
              <div className="reading-list-header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="reading-list-title">Reading List</h1>
                <p className="reading-list-subtitle">
                  {bookmarkedSlugs.length === 0
                    ? "No saved articles"
                    : `${bookmarkedSlugs.length} ${bookmarkedSlugs.length === 1 ? "article" : "articles"} saved`}
                </p>
              </div>
            </div>
            {bookmarkedSlugs.length > 0 && (
              <button onClick={handleClearAll} className="reading-list-clear-btn">
                Clear all
              </button>
            )}
          </motion.header>

          {/* Content */}
          {isLoading ? (
            <PostListSkeleton count={3} />
          ) : bookmarkedSlugs.length === 0 ? (
            <EmptyState />
          ) : posts === undefined ? (
            <PostListSkeleton count={bookmarkedSlugs.length} />
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="reading-list-posts">
                {sortedPosts.map((post, index) => (
                  <ReadingListItem
                    key={post.slug}
                    post={post}
                    index={index}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
