// Falls back to localhost so metadataBase resolves in local dev; set
// NEXT_PUBLIC_SITE_URL in production so OG/canonical URLs are absolute.
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

export const SITE_NAME = "GoPkg";
