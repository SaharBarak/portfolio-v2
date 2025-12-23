"use client";

import { useState } from "react";

export default function SyncPage() {
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [results, setResults] = useState<Record<string, { synced: number; errors: number }> | null>(null);
  const [secret, setSecret] = useState("");

  const handleSync = async () => {
    if (!secret) {
      alert("Please enter the sync secret");
      return;
    }

    setStatus("syncing");
    setResults(null);

    try {
      const response = await fetch(`/api/sync?secret=${encodeURIComponent(secret)}`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setResults(data.results);
      } else {
        setStatus("error");
        setResults(null);
      }
    } catch {
      setStatus("error");
      setResults(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          padding: "2.5rem",
          maxWidth: "400px",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          Notion to Convex Sync
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.875rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          Sync your Notion content to the portfolio
        </p>

        <input
          type="password"
          placeholder="Enter sync secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.05)",
            color: "#fff",
            fontSize: "0.875rem",
            marginBottom: "1rem",
            outline: "none",
            boxSizing: "border-box",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSync()}
        />

        <button
          onClick={handleSync}
          disabled={status === "syncing"}
          style={{
            width: "100%",
            padding: "0.875rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            background:
              status === "syncing"
                ? "rgba(139, 92, 246, 0.5)"
                : status === "success"
                  ? "#10b981"
                  : status === "error"
                    ? "#ef4444"
                    : "#8b5cf6",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: status === "syncing" ? "wait" : "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {status === "syncing" && (
            <span
              style={{
                width: "1rem",
                height: "1rem",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          {status === "idle" && "Sync Now"}
          {status === "syncing" && "Syncing..."}
          {status === "success" && "Synced!"}
          {status === "error" && "Failed - Try Again"}
        </button>

        {results && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "rgba(16, 185, 129, 0.1)",
              borderRadius: "0.5rem",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <p
              style={{
                color: "#10b981",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              Sync Results
            </p>
            {Object.entries(results).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.875rem",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{key}</span>
                <span>
                  {value.synced} synced
                  {value.errors > 0 && (
                    <span style={{ color: "#ef4444" }}> / {value.errors} errors</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        <p
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: "0.75rem",
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Bookmark this page in Notion for quick access
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
