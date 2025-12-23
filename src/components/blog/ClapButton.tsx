"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface ClapButtonProps {
  slug: string;
}

// Generate a visitor ID and store in localStorage
function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem("blog-visitor-id");
  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("blog-visitor-id", visitorId);
  }
  return visitorId;
}

export default function ClapButton({ slug }: ClapButtonProps) {
  const [visitorId, setVisitorId] = useState<string>("");
  const [localClaps, setLocalClaps] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<{ id: number; value: number }[]>([]);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingClapsRef = useRef(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const floatingIdRef = useRef(0);

  // Initialize visitor ID on client
  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  // Convex queries and mutation
  const clapsData = useQuery(api.claps.getClaps, { slug });
  const visitorClaps = useQuery(
    api.claps.getVisitorClaps,
    visitorId ? { slug, visitorId } : "skip"
  );
  const addClap = useMutation(api.claps.addClap);

  // Sync local claps with server
  useEffect(() => {
    if (typeof visitorClaps === "number") {
      setLocalClaps(visitorClaps);
    }
  }, [visitorClaps]);

  const maxReached = localClaps >= 50;

  // Debounced sync to server
  const syncToServer = useCallback(() => {
    if (pendingClapsRef.current > 0 && visitorId) {
      const increment = pendingClapsRef.current;
      pendingClapsRef.current = 0;
      addClap({ slug, visitorId, increment });
    }
  }, [slug, visitorId, addClap]);

  // Handle single clap
  const handleClap = useCallback(() => {
    if (maxReached) return;

    // Increment local state immediately
    setLocalClaps((prev) => Math.min(prev + 1, 50));
    pendingClapsRef.current += 1;

    // Show burst animation
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 300);

    // Add floating number
    const newId = floatingIdRef.current++;
    setFloatingNumbers((prev) => [...prev, { id: newId, value: pendingClapsRef.current }]);
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== newId));
    }, 1000);

    // Debounce server sync
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(syncToServer, 500);
  }, [maxReached, syncToServer]);

  // Handle hold to clap
  const startHolding = useCallback(() => {
    if (maxReached) return;
    setIsHolding(true);
    handleClap();

    holdIntervalRef.current = setInterval(() => {
      if (pendingClapsRef.current + localClaps >= 50) {
        stopHolding();
        return;
      }
      handleClap();
    }, 150);
  }, [handleClap, maxReached, localClaps]);

  const stopHolding = useCallback(() => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        syncToServer(); // Sync any pending claps
      }
    };
  }, [syncToServer]);

  const totalClaps = (clapsData?.totalClaps ?? 0) + pendingClapsRef.current;

  return (
    <div className="clap-button-container">
      <div className="clap-button-wrapper">
        {/* Floating numbers */}
        <AnimatePresence>
          {floatingNumbers.map((num) => (
            <motion.span
              key={num.id}
              className="clap-floating-number"
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -40, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              +{num.value}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Burst effect */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              className="clap-burst"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Main button */}
        <motion.button
          className={`clap-button ${localClaps > 0 ? "clapped" : ""} ${maxReached ? "max-reached" : ""}`}
          onMouseDown={startHolding}
          onMouseUp={stopHolding}
          onMouseLeave={stopHolding}
          onTouchStart={startHolding}
          onTouchEnd={stopHolding}
          whileTap={{ scale: 0.95 }}
          animate={isHolding ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.15, repeat: isHolding ? Infinity : 0 }}
          disabled={maxReached}
          aria-label={maxReached ? "Maximum claps reached" : "Clap for this article"}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={localClaps > 0 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={showBurst ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.2 }}
          >
            {/* Clapping hands icon */}
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </motion.svg>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="clap-stats">
        <span className="clap-total">{totalClaps.toLocaleString()}</span>
        {localClaps > 0 && (
          <span className="clap-yours">
            ({localClaps} from you{maxReached ? " - max!" : ""})
          </span>
        )}
      </div>

      {/* Hint text */}
      {localClaps === 0 && (
        <p className="clap-hint">Hold to clap more</p>
      )}
    </div>
  );
}
