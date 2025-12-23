"use client";

import { useState, useEffect, useRef } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const highlight = async () => {
      try {
        const html = await codeToHtml(code, {
          lang: language || "text",
          theme: "github-dark-dimmed",
        });
        setHighlightedHtml(html);
      } catch {
        // Fallback for unsupported languages
        setHighlightedHtml(`<pre><code>${escapeHtml(code)}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlight();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const lineCount = code.split("\n").length;

  return (
    <div className="blog-code-block-wrapper">
      <div className="blog-code-header">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename ? (
            <span className="text-xs text-neutral-400 font-mono">{filename}</span>
          ) : (
            <span className="text-xs text-neutral-500 font-mono">{language || "code"}</span>
          )}
        </div>
        <button onClick={handleCopy} className="blog-copy-btn" title={copied ? "Copied!" : "Copy code"}>
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="blog-code-content-wrapper">
        {showLineNumbers && (
          <div className="blog-code-line-numbers">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
        )}
        <div
          ref={codeRef}
          className={`blog-code-content ${isLoading ? "opacity-50" : ""}`}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>
    </div>
  );
}
