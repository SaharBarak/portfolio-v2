"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Comment {
  _id: Id<"blogComments">;
  slug: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  parentId?: Id<"blogComments">;
  likes?: number;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CommentForm({
  slug,
  parentId,
  onCancel,
  placeholder = "Share your thoughts...",
}: {
  slug: string;
  parentId?: Id<"blogComments">;
  onCancel?: () => void;
  placeholder?: string;
}) {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addComment = useMutation(api.comments.add);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addComment({
        slug,
        userId: user.id,
        userName: user.fullName || user.username || "Anonymous",
        userImage: user.imageUrl,
        content: content.trim(),
        parentId,
      });
      setContent("");
      onCancel?.();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div
        className="blog-comment-auth"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "var(--space-8) 0",
        }}
      >
        <p
          className="font-body"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--blog-text-muted)",
            marginBottom: "var(--space-4)",
          }}
        >
          Sign in to join the conversation
        </p>
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <SignInButton mode="modal">
            <button className="blog-btn-secondary">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="blog-btn-primary">Sign Up</button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="blog-comment-form">
      <div className="flex gap-3">
        {user.imageUrl && (
          <img
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="blog-comment-textarea"
          />
          <div className="flex justify-end gap-2 mt-2">
            {onCancel && (
              <button type="button" onClick={onCancel} className="blog-btn-ghost">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="blog-btn-primary"
            >
              {isSubmitting ? "Posting..." : parentId ? "Reply" : "Comment"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  slug,
  replies,
}: {
  comment: Comment;
  slug: string;
  replies: Comment[];
}) {
  const { user } = useUser();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);

  const updateComment = useMutation(api.comments.update);
  const deleteComment = useMutation(api.comments.remove);
  const likeComment = useMutation(api.comments.like);

  const isOwner = user?.id === comment.userId;

  const handleEdit = async () => {
    if (!editContent.trim() || !user) return;
    try {
      await updateComment({
        commentId: comment._id,
        userId: user.id,
        content: editContent.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm("Delete this comment?")) return;
    try {
      await deleteComment({
        commentId: comment._id,
        userId: user.id,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLike = async () => {
    try {
      await likeComment({ commentId: comment._id });
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="blog-comment"
    >
      <div className="flex gap-3">
        {comment.userImage ? (
          <img
            src={comment.userImage}
            alt={comment.userName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-purple-400">
              {comment.userName[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-white text-sm">{comment.userName}</span>
            <span className="text-xs text-neutral-500">{formatTimeAgo(comment.createdAt)}</span>
            {comment.updatedAt && (
              <span className="text-xs text-neutral-600">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="blog-comment-textarea"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setIsEditing(false)} className="blog-btn-ghost text-sm">
                  Cancel
                </button>
                <button onClick={handleEdit} className="blog-btn-primary text-sm">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-300 whitespace-pre-wrap">{comment.content}</p>
          )}

          {!isEditing && (
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-purple-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {(comment.likes || 0) > 0 && <span>{comment.likes}</span>}
              </button>

              {user && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-xs text-neutral-500 hover:text-purple-400 transition-colors"
                >
                  Reply
                </button>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-neutral-500 hover:text-purple-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <CommentForm
                  slug={slug}
                  parentId={comment._id}
                  onCancel={() => setIsReplying(false)}
                  placeholder={`Reply to ${comment.userName}...`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors mb-3"
              >
                {showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>
              <AnimatePresence>
                {showReplies && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pl-4 border-l border-white/5"
                  >
                    {replies.map((reply) => (
                      <CommentItem key={reply._id} comment={reply} slug={slug} replies={[]} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommentsSection({ slug }: { slug: string }) {
  const comments = useQuery(api.comments.getBySlug, { slug });
  const commentCount = useQuery(api.comments.getCount, { slug });

  const { topLevelComments, repliesByParent } = useMemo(() => {
    if (!comments) return { topLevelComments: [], repliesByParent: new Map() };

    const topLevel: Comment[] = [];
    const replies = new Map<string, Comment[]>();

    comments.forEach((comment) => {
      if (!comment.parentId) {
        topLevel.push(comment);
      } else {
        const parentReplies = replies.get(comment.parentId) || [];
        parentReplies.push(comment);
        replies.set(comment.parentId, parentReplies);
      }
    });

    // Sort top-level by newest first
    topLevel.sort((a, b) => b.createdAt - a.createdAt);

    return { topLevelComments: topLevel, repliesByParent: replies };
  }, [comments]);

  return (
    <section className="blog-comments-section">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-bold text-white">Discussion</h3>
        {commentCount !== undefined && commentCount > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
            {commentCount}
          </span>
        )}
      </div>

      <CommentForm slug={slug} />

      <div className="mt-8 space-y-6">
        <AnimatePresence>
          {topLevelComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              slug={slug}
              replies={repliesByParent.get(comment._id) || []}
            />
          ))}
        </AnimatePresence>

        {comments !== undefined && topLevelComments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-500">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p className="text-neutral-400">Be the first to comment!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
