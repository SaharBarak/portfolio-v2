"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface EngagementBarProps {
  slug: string;
  title: string;
}

export default function EngagementBar({ slug, title }: EngagementBarProps) {
  const { user } = useUser();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  // Convex queries and mutations
  const likes = useQuery(api.likes.getBySlug, { slug });
  const userLiked = useQuery(
    api.likes.hasLiked,
    user ? { slug, userId: user.id } : "skip"
  );
  const toggleLike = useMutation(api.likes.toggle);

  const url = typeof window !== "undefined" ? window.location.href : "";

  // Load bookmarked state from localStorage
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("blog-bookmarks") || "[]");
    setBookmarked(bookmarks.includes(slug));

    const feedback = localStorage.getItem(`feedback-${slug}`);
    if (feedback) setHelpful(feedback as "yes" | "no");
  }, [slug]);

  const handleLike = async () => {
    if (!user) return;
    await toggleLike({ slug, userId: user.id, userName: user.fullName || "Anonymous" });
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("blog-bookmarks") || "[]");
    if (bookmarked) {
      const updated = bookmarks.filter((s: string) => s !== slug);
      localStorage.setItem("blog-bookmarks", JSON.stringify(updated));
    } else {
      bookmarks.push(slug);
      localStorage.setItem("blog-bookmarks", JSON.stringify(bookmarks));
    }
    setBookmarked(!bookmarked);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShareMenu(false);
  };

  const handleHelpful = (value: "yes" | "no") => {
    setHelpful(value);
    localStorage.setItem(`feedback-${slug}`, value);
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 2000);
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Reddit",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: "Hacker News",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0v24h24V0H0zm11.52 15.984v4.608h1.008v-4.608l4.272-8.544h-1.104l-3.648 7.296-3.648-7.296H7.248l4.272 8.544z" />
        </svg>
      ),
      url: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div className="engagement-bar">
      {/* Main Actions Row */}
      <div className="engagement-actions">
        {/* Like Button */}
        {user ? (
          <button
            onClick={handleLike}
            className={`engagement-btn ${userLiked ? "active" : ""}`}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={userLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              whileTap={{ scale: 1.2 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
            <span>Like{likes?.count ? ` (${likes.count})` : ""}</span>
          </button>
        ) : (
          <SignInButton mode="modal">
            <button className="engagement-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Like</span>
            </button>
          </SignInButton>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`engagement-btn ${bookmarked ? "active" : ""}`}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            whileTap={{ scale: 1.2 }}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </motion.svg>
          <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="engagement-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>

          <AnimatePresence>
            {showShareMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowShareMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="share-dropdown"
                >
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-item"
                      onClick={() => setShowShareMenu(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ))}
                  <button onClick={handleCopy} className="share-item">
                    {copied ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                    <span>{copied ? "Copied!" : "Copy link"}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Support Button */}
        <a
          href="https://github.com/sponsors/SaharBarak"
          target="_blank"
          rel="noopener noreferrer"
          className="engagement-btn support-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span>Support</span>
        </a>
      </div>

      {/* Helpful Feedback */}
      <div className="helpful-section">
        {showThanks ? (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="helpful-thanks"
          >
            Thanks for your feedback!
          </motion.p>
        ) : helpful ? (
          <p className="helpful-answered">
            You found this {helpful === "yes" ? "helpful" : "not helpful"}
          </p>
        ) : (
          <>
            <p className="helpful-question">Was this article helpful?</p>
            <div className="helpful-buttons">
              <button onClick={() => handleHelpful("yes")} className="helpful-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
                Yes
              </button>
              <button onClick={() => handleHelpful("no")} className="helpful-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
                No
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
