"use client";

import { useAvailability } from "@/hooks/useContent";

interface AvailabilityBadgeProps {
  className?: string;
  showCalendly?: boolean;
}

export function AvailabilityBadge({ className = "", showCalendly = true }: AvailabilityBadgeProps) {
  const availability = useAvailability();

  // Fallback while loading
  const status = availability?.status || "Available";
  const isAvailable = availability?.isAvailable ?? true;
  const calendlyUrl = availability?.calendlyUrl;

  // Get current month and year
  const now = new Date();
  const monthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Status colors
  const statusColors = {
    Available: { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e", dot: "#22c55e" },
    Limited: { bg: "rgba(234, 179, 8, 0.15)", text: "#eab308", dot: "#eab308" },
    Booked: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", dot: "#ef4444" },
  };

  const colors = statusColors[status as keyof typeof statusColors] || statusColors.Available;

  // Custom message or default
  const message = availability?.message || `Available ${monthYear}`;

  const badge = (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${className}`}
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.text}20`,
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2">
        {isAvailable && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: colors.dot }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: colors.dot }}
        />
      </span>

      {/* Status text */}
      <span
        className="text-sm font-medium"
        style={{ color: colors.text }}
      >
        {message}
      </span>
    </div>
  );

  // If showCalendly and we have a URL, wrap in a link
  if (showCalendly && calendlyUrl) {
    return (
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-90 transition-opacity"
      >
        {badge}
      </a>
    );
  }

  return badge;
}
