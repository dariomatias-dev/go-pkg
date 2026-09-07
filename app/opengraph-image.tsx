import { ImageResponse } from "next/og";

// A per-package dynamic OG image (rendered from live GitHub/proxy data)
// isn't possible here: opengraph-image.tsx colocated inside the
// app/package/[...importPath] catch-all segment fails the build with
// "Catch-all must be the last part of the URL" — Next treats the image
// as an implicit route appended after the catch-all, which its own
// routing rules forbid. This shared image is used site-wide instead,
// including on package pages.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        background: "#0d1117",
        color: "#f0f6fc",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#00ADD8",
          }}
        />
        <div style={{ fontSize: 72, fontWeight: 800 }}>GoPkg</div>
      </div>

      <div style={{ display: "flex", fontSize: 30, color: "#8b949e" }}>
        Search and explore Go packages
      </div>
    </div>,
    { ...size },
  );
}
