"use client";

import { motion } from "framer-motion";

// Skeleton for individual post in list
export function PostSkeleton() {
  return (
    <div className="skeleton-post">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-excerpt" />
        <div className="skeleton skeleton-excerpt-short" />
        <div className="skeleton skeleton-meta" />
      </div>
    </div>
  );
}

// Skeleton for post list
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <PostSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton for welcome section
export function WelcomeSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="flex flex-col items-center gap-4">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton skeleton-text" style={{ width: "200px" }} />
        <div className="skeleton skeleton-text" style={{ width: "300px" }} />
        <div className="flex gap-3 mt-2">
          <div className="skeleton" style={{ width: "80px", height: "32px", borderRadius: "9999px" }} />
          <div className="skeleton" style={{ width: "80px", height: "32px", borderRadius: "9999px" }} />
          <div className="skeleton" style={{ width: "80px", height: "32px", borderRadius: "9999px" }} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for popular posts
export function PopularPostsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="skeleton" style={{ width: "24px", height: "24px" }} />
          <div className="flex-1">
            <div className="skeleton skeleton-text mb-2" style={{ width: "90%" }} />
            <div className="skeleton skeleton-text" style={{ width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for topic cards
export function TopicCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="flex flex-col gap-3">
            <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "0.75rem" }} />
            <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            <div className="skeleton skeleton-text" style={{ width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for article page
export function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="skeleton skeleton-meta mb-4" style={{ width: "120px" }} />
        <div className="skeleton" style={{ height: "2.5rem", width: "100%", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: "2.5rem", width: "70%", marginBottom: "1.5rem" }} />
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: "60px", height: "24px", borderRadius: "9999px" }} />
          ))}
        </div>
        {/* Cover image */}
        <div className="skeleton" style={{ width: "100%", height: "400px", borderRadius: "1rem" }} />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton skeleton-text mb-2" style={{ width: "100%" }} />
            <div className="skeleton skeleton-text mb-2" style={{ width: "95%" }} />
            <div className="skeleton skeleton-text" style={{ width: i % 2 === 0 ? "80%" : "70%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Default export with all skeletons
export default {
  Post: PostSkeleton,
  PostList: PostListSkeleton,
  Welcome: WelcomeSkeleton,
  PopularPosts: PopularPostsSkeleton,
  TopicCards: TopicCardsSkeleton,
  Article: ArticleSkeleton,
};
