// Canonical origin. On Vercel the production hostname is injected at build time.
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (fromVercel ? `https://${fromVercel}` : "http://localhost:3000");
