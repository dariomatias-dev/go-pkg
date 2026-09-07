"use client";

import { useEffect } from "react";

// global-error replaces the root layout entirely when it fires, so it
// can't rely on globals.css, next/font, or any other layout dependency
// - it must be fully self-contained, plain HTML/inline styles only.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Root layout error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: 24,
          background: "#F8FAFC",
          color: "#0f172a",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
          GoPkg hit an unexpected error
        </h1>

        <p style={{ maxWidth: 380, fontSize: 14, color: "#64748b" }}>
          Something broke badly enough that the whole page failed to render.
          Reloading usually fixes a transient failure.
        </p>

        {error.digest && (
          <p
            style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}
          >
            Reference: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            cursor: "pointer",
            borderRadius: 8,
            border: "none",
            background: "#006680",
            color: "white",
            padding: "10px 18px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
