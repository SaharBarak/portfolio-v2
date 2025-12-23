"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface LikeButtonProps {
  slug: string;
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const { user, isLoaded } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);

  const likesData = useQuery(api.likes.getBySlug, { slug });
  const hasLiked = useQuery(
    api.likes.hasLiked,
    user ? { slug, userId: user.id } : "skip"
  );
  const toggleLike = useMutation(api.likes.toggle);

  const handleLike = async () => {
    if (!user) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    await toggleLike({
      slug,
      userId: user.id,
      userName: user.fullName || user.username || "Anonymous",
      userImage: user.imageUrl,
    });
  };

  if (!isLoaded) {
    return (
      <div className="blog-like-button-skeleton">
        <div className="w-20 h-10 bg-white/5 rounded-full animate-pulse" />
      </div>
    );
  }

  const likeCount = likesData?.count || 0;
  const likedUsers = likesData?.users || [];
  const isLiked = hasLiked === true;

  return (
    <div className="blog-like-wrapper">
      {/* Like Button */}
      {user ? (
        <motion.button
          onClick={handleLike}
          className={`blog-like-button ${isLiked ? "liked" : ""}`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </motion.div>
          <span>{likeCount > 0 ? likeCount : "Like"}</span>

          {/* Particle animation on like */}
          <AnimatePresence>
            {isAnimating && isLiked && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="blog-like-particle"
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1,
                      x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                      y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.button>
      ) : (
        <SignInButton mode="modal">
          <button className="blog-like-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{likeCount > 0 ? likeCount : "Like"}</span>
          </button>
        </SignInButton>
      )}

      {/* Liked by users */}
      {likedUsers.length > 0 && (
        <div className="blog-liked-by">
          <div className="blog-liked-avatars">
            {likedUsers.slice(0, 5).map((u, i) => (
              <div
                key={u.userId}
                className="blog-liked-avatar"
                style={{ zIndex: 5 - i }}
                title={u.userName}
              >
                {u.userImage ? (
                  <img src={u.userImage} alt={u.userName} />
                ) : (
                  <span>{u.userName[0]?.toUpperCase()}</span>
                )}
              </div>
            ))}
            {likeCount > 5 && (
              <div className="blog-liked-avatar blog-liked-more">
                +{likeCount - 5}
              </div>
            )}
          </div>
          <span className="blog-liked-text">
            {likeCount === 1
              ? `${likedUsers[0].userName} liked this`
              : `${likeCount} people liked this`}
          </span>
        </div>
      )}
    </div>
  );
}
