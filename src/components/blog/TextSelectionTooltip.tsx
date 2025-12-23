"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TextSelectionTooltipProps {
  articleTitle: string;
  articleUrl?: string;
}

export default function TextSelectionTooltip({ articleTitle, articleUrl }: TextSelectionTooltipProps) {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const url = articleUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || "";

    // Only show tooltip for meaningful selections
    if (text.length < 10) {
      setIsVisible(false);
      setSelectedText("");
      return;
    }

    // Check if selection is within the article content
    const range = selection?.getRangeAt(0);
    if (!range) return;

    const articleContent = document.querySelector(".blog-content, article");
    if (!articleContent?.contains(range.commonAncestorContainer)) {
      setIsVisible(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    setSelectedText(text);
    setPosition({
      top: rect.top + scrollTop - 50,
      left: rect.left + rect.width / 2,
    });
    setIsVisible(true);
    setCopied(false);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleSelection, handleClickOutside]);

  const shareOnTwitter = () => {
    const truncatedText = selectedText.length > 200
      ? selectedText.slice(0, 200) + "..."
      : selectedText;
    const tweetText = `"${truncatedText}" - from "${articleTitle}"`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "width=550,height=420");
    setIsVisible(false);
  };

  const copyQuote = async () => {
    const quoteText = `"${selectedText}" - ${articleTitle}\n${url}`;
    await navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => {
      setIsVisible(false);
      setCopied(false);
    }, 1500);
  };

  const highlightQuote = () => {
    // Create a highlight effect (could be extended to save highlights)
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.className = "text-highlight";
    span.style.cssText = "background: rgba(251, 191, 36, 0.3); border-radius: 2px; padding: 0 2px;";

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
    } catch {
      // Handle complex selections that span multiple elements
    }

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.15 }}
          className="text-selection-tooltip"
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
            transform: "translateX(-50%)",
            zIndex: 100,
          }}
        >
          <div className="tooltip-content">
            <button onClick={shareOnTwitter} className="tooltip-btn" title="Tweet this quote">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Tweet</span>
            </button>
            <button onClick={copyQuote} className="tooltip-btn" title="Copy quote">
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
            <button onClick={highlightQuote} className="tooltip-btn" title="Highlight">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span>Highlight</span>
            </button>
          </div>
          <div className="tooltip-arrow" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
