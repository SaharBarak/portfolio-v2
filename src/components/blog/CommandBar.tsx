"use client";

import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
}

interface CommandBarProps {
  posts: BlogPost[];
  tags: string[];
  onTagSelect: (tag: string | null) => void;
}

export default function CommandBar({ posts, tags, onTagSelect }: CommandBarProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Toggle with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((value: string) => {
    if (value.startsWith("post:")) {
      router.push(`/blog/${value.replace("post:", "")}`);
      setOpen(false);
    } else if (value.startsWith("tag:")) {
      onTagSelect(value.replace("tag:", ""));
      setOpen(false);
    } else if (value === "all") {
      onTagSelect(null);
      setOpen(false);
    }
    setSearch("");
  }, [router, onTagSelect]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all group"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-neutral-500"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="flex-1 text-left text-neutral-500 text-sm">Search articles, tags...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-500">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2"
            >
              <Command
                className="rounded-2xl border border-white/10 bg-[#0c0c10] shadow-2xl overflow-hidden"
                loop
              >
                <div className="flex items-center gap-3 px-4 border-b border-white/5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neutral-500 shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search articles, topics..."
                    className="flex-1 py-4 bg-transparent text-white placeholder:text-neutral-500 focus:outline-none text-[15px]"
                  />
                  <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-500">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  <Command.Empty className="py-12 text-center text-neutral-500 text-sm">
                    No results found.
                  </Command.Empty>

                  {/* Quick Actions */}
                  <Command.Group heading="Quick Actions" className="mb-2">
                    <Command.Item
                      value="all"
                      onSelect={handleSelect}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-neutral-300 data-[selected=true]:bg-white/5 data-[selected=true]:text-white transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                      </div>
                      <span className="text-sm">View all articles</span>
                    </Command.Item>
                  </Command.Group>

                  {/* Topics */}
                  {tags.length > 0 && (
                    <Command.Group heading="Topics" className="mb-2">
                      {tags.slice(0, 6).map((tag) => (
                        <Command.Item
                          key={tag}
                          value={`tag:${tag}`}
                          onSelect={handleSelect}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-neutral-300 data-[selected=true]:bg-white/5 data-[selected=true]:text-white transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                          </div>
                          <span className="text-sm">{tag}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {/* Articles */}
                  {posts.length > 0 && (
                    <Command.Group heading="Articles">
                      {posts.slice(0, 8).map((post) => (
                        <Command.Item
                          key={post.slug}
                          value={`post:${post.slug} ${post.title} ${post.tags.join(" ")}`}
                          onSelect={() => handleSelect(`post:${post.slug}`)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-neutral-300 data-[selected=true]:bg-white/5 data-[selected=true]:text-white transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{post.title}</p>
                            <p className="text-xs text-neutral-500 truncate">{post.excerpt}</p>
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
                </Command.List>

                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd>
                      select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd>
                      navigate
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">esc</kbd>
                    close
                  </span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
