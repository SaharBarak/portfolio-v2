"use client";

import React, { use, useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useBlogPost, useBlogPosts } from "@/hooks/useContent";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommentsSection from "@/components/blog/CommentsSection";
import EngagementBar from "@/components/blog/EngagementBar";
import ArticleNewsletter from "@/components/blog/ArticleNewsletter";
import CodeBlock from "@/components/blog/CodeBlock";
import BlogSkyToolbar from "@/components/blog/BlogSkyToolbar";
import ClapButton from "@/components/blog/ClapButton";
import TextSelectionTooltip from "@/components/blog/TextSelectionTooltip";
import BlogCover from "@/components/blog/BlogCover";
import BlogHeader from "@/components/blog/BlogHeader";
import MobileBottomNav from "@/components/blog/MobileBottomNav";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

type ReactionType = "fire" | "heart" | "rocket" | "mindBlown" | "lightbulb";

const REACTION_EMOJIS: Record<ReactionType, { emoji: string; label: string }> = {
  fire: { emoji: "🔥", label: "Fire" },
  heart: { emoji: "❤️", label: "Love" },
  rocket: { emoji: "🚀", label: "Rocket" },
  mindBlown: { emoji: "🤯", label: "Mind Blown" },
  lightbulb: { emoji: "💡", label: "Insightful" },
};

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-[var(--card-border)]">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function TableOfContents({ items, activeId }: { items: TOCItem[]; activeId: string }) {
  if (items.length === 0) return null;

  return (
    <nav className="sticky top-28 hidden xl:block" style={{ maxHeight: "calc(100vh - 8rem)" }}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">
        On this page
      </p>
      <ul className="space-y-2 overflow-y-auto pr-4" style={{ maxHeight: "calc(100vh - 12rem)" }}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm transition-colors duration-200 hover:text-[var(--accent)] ${activeId === item.id ? "text-[var(--accent)] font-medium" : "text-[var(--text-muted)]"}`}
              style={{
                paddingLeft: `${(item.level - 1) * 12}px`,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ReactionBar({ slug }: { slug: string }) {
  const reactions = useQuery(api.blog.getReactions, { slug });
  const addReaction = useMutation(api.blog.addReaction);
  const [reacted, setReacted] = useState<Set<ReactionType>>(new Set());

  // Load reacted state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`reactions-${slug}`);
    if (stored) {
      setReacted(new Set(JSON.parse(stored)));
    }
  }, [slug]);

  const handleReaction = async (reaction: ReactionType) => {
    if (reacted.has(reaction)) return;

    await addReaction({ slug, reaction });
    const newReacted = new Set(reacted).add(reaction);
    setReacted(newReacted);
    localStorage.setItem(`reactions-${slug}`, JSON.stringify([...newReacted]));
  };

  if (!reactions) return null;

  return (
    <div className="blog-reactions-bar">
      <p>React to this article</p>
      <div className="flex">
        {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((key) => {
          const { emoji, label } = REACTION_EMOJIS[key];
          const hasReacted = reacted.has(key);

          return (
            <button
              key={key}
              onClick={() => handleReaction(key)}
              disabled={hasReacted}
              className={`blog-reaction-btn ${hasReacted ? "reacted" : ""}`}
              title={label}
            >
              <span>{emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-[var(--text-muted)] mr-2">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-share-btn"
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
      <button onClick={handleCopy} className="blog-share-btn" title={copied ? "Copied!" : "Copy link"}>
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const renderContent = useCallback(() => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements: React.JSX.Element[] = [];
    let i = 0;
    let listItems: string[] = [];
    let isNumberedList = false;
    let codeBlock: string[] = [];
    let codeLanguage = "";
    let inCodeBlock = false;

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = isNumberedList ? "ol" : "ul";
        elements.push(
          <ListTag key={`list-${elements.length}`} className={isNumberedList ? "blog-ol" : "blog-ul"}>
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            ))}
          </ListTag>
        );
        listItems = [];
      }
    };

    const parseInline = (text: string): string => {
      text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
      text = text.replace(/`(.+?)`/g, '<code class="blog-inline-code">$1</code>');
      text = text.replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      return text;
    };

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <CodeBlock key={`code-${elements.length}`} code={codeBlock.join("\n")} language={codeLanguage} />
          );
          codeBlock = [];
          codeLanguage = "";
          inCodeBlock = false;
        } else {
          flushList();
          codeLanguage = line.slice(3).trim();
          inCodeBlock = true;
        }
        i++;
        continue;
      }

      if (inCodeBlock) {
        codeBlock.push(line);
        i++;
        continue;
      }

      if (line.trim() === "") {
        flushList();
        i++;
        continue;
      }

      if (line.startsWith("### ")) {
        flushList();
        const text = line.slice(4);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        elements.push(<h3 key={`h3-${elements.length}`} id={id} className="blog-h3" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />);
        i++;
        continue;
      }

      if (line.startsWith("## ")) {
        flushList();
        const text = line.slice(3);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        elements.push(<h2 key={`h2-${elements.length}`} id={id} className="blog-h2" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />);
        i++;
        continue;
      }

      if (line.startsWith("# ")) {
        flushList();
        const text = line.slice(2);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        elements.push(<h1 key={`h1-${elements.length}`} id={id} className="blog-h1" dangerouslySetInnerHTML={{ __html: parseInline(text) }} />);
        i++;
        continue;
      }

      if (line.trim() === "---") {
        flushList();
        elements.push(<hr key={`hr-${elements.length}`} className="blog-hr" />);
        i++;
        continue;
      }

      if (line.startsWith("> ")) {
        flushList();
        elements.push(<blockquote key={`quote-${elements.length}`} className="blog-blockquote" dangerouslySetInnerHTML={{ __html: parseInline(line.slice(2)) }} />);
        i++;
        continue;
      }

      if (line.startsWith("- ")) {
        if (isNumberedList) flushList();
        isNumberedList = false;
        listItems.push(line.slice(2));
        i++;
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        if (!isNumberedList && listItems.length > 0) flushList();
        isNumberedList = true;
        listItems.push(line.replace(/^\d+\.\s/, ""));
        i++;
        continue;
      }

      flushList();
      elements.push(<p key={`p-${elements.length}`} className="blog-p" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />);
      i++;
    }

    flushList();
    return elements;
  }, [content]);

  return <div className="blog-content">{renderContent()}</div>;
}

function AuthorCard() {
  return (
    <div className="blog-author-card">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-[var(--background)]">
          S
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-[var(--text-strong)] mb-1">Sahar Barak</h4>
          <p className="text-sm text-[var(--text-muted)] mb-3">
            Engineer, researcher, and builder. Writing about AI, identity systems, clean energy, and the future of software.
          </p>
          <div className="flex gap-3">
            <a
              href="https://twitter.com/saharbarak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/SaharBarak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/sahar-barak"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedPosts({ currentSlug, currentTags }: { currentSlug: string; currentTags: string[] }) {
  const allPosts = useBlogPosts();

  const relatedPosts = useMemo(() => {
    if (!allPosts) return [];
    return allPosts
      .filter((p) => p.slug !== currentSlug)
      .filter((p) => p.tags?.some((t) => currentTags.includes(t)))
      .slice(0, 2);
  }, [allPosts, currentSlug, currentTags]);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-[var(--card-border)]">
      <h3 className="text-xl font-bold text-[var(--text-strong)] mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-xl bg-[var(--card)] border border-[var(--card-border)] hover:border-[var(--accent)]/30 transition-all overflow-hidden"
          >
            <BlogCover
              coverImage={post.coverImage}
              title={post.title}
              slug={post.slug}
              tags={post.tags}
              size="medium"
            />
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags?.slice(0, 2).map((tag) => (
                  <span key={tag} className="blog-tag-sm">{tag}</span>
                ))}
              </div>
              <h4 className="font-semibold text-[var(--text-strong)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const post = useBlogPost(slug);
  const incrementViews = useMutation(api.blog.incrementViews);
  const [activeHeading, setActiveHeading] = useState("");
  const [viewIncremented, setViewIncremented] = useState(false);

  // Increment view count once
  useEffect(() => {
    if (post && !viewIncremented) {
      incrementViews({ slug });
      setViewIncremented(true);
    }
  }, [post, slug, incrementViews, viewIncremented]);

  const tocItems = useMemo((): TOCItem[] => {
    if (!post?.content) return [];
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const items: TOCItem[] = [];
    let match;
    while ((match = headingRegex.exec(post.content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      items.push({ id, text, level });
    }
    return items;
  }, [post?.content]);

  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const readingTime = useMemo(() => {
    if (!post?.content) return 0;
    const wordsPerMinute = 200;
    const wordCount = post.content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }, [post?.content]);

  // Loading state
  if (post === undefined) {
    return (
      <div className="blog-page-wrapper">
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-[var(--card-border)] rounded w-20" />
              <div className="h-12 bg-[var(--card-border)] rounded w-3/4" />
              <div className="h-4 bg-[var(--card-border)] rounded w-1/4" />
              <div className="h-64 bg-[var(--card-border)] rounded mt-8" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found
  if (post === null) {
    return (
      <div className="blog-page-wrapper">
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="blog-icon-box-lg mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-strong)] mb-4">Post Not Found</h1>
              <p className="text-lg text-[var(--text-muted)] mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/blog" className="blog-btn-primary inline-flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="blog-page-wrapper">
      <ReadingProgressBar />
      <Header />
      <BlogHeader title={post.title} />
      <BlogSkyToolbar />
      <TextSelectionTooltip articleTitle={post.title} />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-12">
            {/* Main content */}
            <article className="max-w-3xl">
              {/* Back link */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <Link href="/blog" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  Back to Blog
                </Link>
              </motion.div>

              {/* Header */}
              <motion.header className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                )}

                <h1 className="blog-article-title">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {formattedDate && (
                    <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formattedDate}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {readingTime} min read
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {post.views || 0} views
                  </span>
                </div>

                <ShareButtons title={post.title} slug={slug} />
              </motion.header>

              {/* Cover Image - auto-generates gradient if no coverImage */}
              <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <BlogCover
                  coverImage={post.coverImage}
                  title={post.title}
                  slug={slug}
                  tags={post.tags}
                  size="hero"
                />
              </motion.div>

              {/* Excerpt */}
              {post.excerpt && (
                <motion.p className="blog-excerpt" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                  {post.excerpt}
                </motion.p>
              )}

              {/* Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                {post.content ? <MarkdownRenderer content={post.content} /> : <p className="text-center py-12 text-[var(--text-muted)]">Content coming soon...</p>}
              </motion.div>

              {/* Clap Button - Medium-style appreciation */}
              <div className="border-t border-b border-[var(--card-border)] py-6 my-8">
                <ClapButton slug={slug} />
              </div>

              {/* Engagement Bar - Like, Bookmark, Share, Support, Helpful */}
              <EngagementBar slug={slug} title={post.title} />

              {/* Reactions */}
              <ReactionBar slug={slug} />

              {/* Newsletter CTA */}
              <ArticleNewsletter />

              {/* Author Card */}
              <AuthorCard />

              {/* Related posts */}
              <RelatedPosts currentSlug={slug} currentTags={post.tags || []} />

              {/* Comments */}
              <CommentsSection slug={slug} />
            </article>

            {/* Sidebar - TOC */}
            <aside className="hidden xl:block blog-toc-sidebar">
              <TableOfContents items={tocItems} activeId={activeHeading} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
