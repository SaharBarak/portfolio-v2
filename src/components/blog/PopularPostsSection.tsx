"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { PopularPostsSkeleton } from "./BlogSkeleton";

interface PopularPost {
  _id: string;
  title: string;
  slug: string;
  date: string;
  views: number;
  rank: number;
}

export default function PopularPostsSection() {
  const popularPosts = useQuery(api.blog.listPopular, { limit: 5 });

  if (popularPosts === undefined) {
    return (
      <section className="popular-posts-section">
        <div className="popular-posts-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <h2>Trending This Month</h2>
        </div>
        <PopularPostsSkeleton />
      </section>
    );
  }

  if (popularPosts.length === 0) return null;

  return (
    <section className="popular-posts-section">
      <div className="popular-posts-header">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <h2>Trending This Month</h2>
      </div>
      <div className="popular-posts-list">
        {popularPosts.map((post: PopularPost, index: number) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`} className="popular-post-item">
              <span className={`popular-post-rank ${post.rank <= 3 ? "top-3" : ""}`}>
                {post.rank}
              </span>
              <div className="popular-post-content">
                <h3 className="popular-post-title">{post.title}</h3>
                <div className="popular-post-meta">
                  <span className="popular-post-views">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {post.views.toLocaleString()}
                  </span>
                  <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
