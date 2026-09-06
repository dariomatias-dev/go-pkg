import type { NextConfig } from "next";

// A nonce-based CSP (Next's own recommended default) would force every
// route into dynamic rendering: "Partial Prerendering is incompatible
// with nonce-based CSP since static shell scripts won't have access to
// the nonce" (Next.js CSP guide). This app relies on Cache Components /
// static shells (see the route map in `next build` output), so
// script-src keeps 'unsafe-inline' instead of paying for that tradeoff.
//
// img-src and frame-src stay broad on purpose: README content and Go
// module metadata come from arbitrary GitHub repos, including inline
// images from any host and YouTube embeds — see
// components/package/detail/tabs/ReadmeTab.tsx. style-src allows the
// Google Fonts stylesheet loaded via @import in app/globals.css.
const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://api.github.com https://proxy.golang.org https://goreportcard.com https://raw.githubusercontent.com",
  "frame-src https://www.youtube.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
