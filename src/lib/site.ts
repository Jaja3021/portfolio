export const SITE_NAME = "Arnold B. Fadriquila, RES";

export const SITE_TAGLINE = "Philippine Real Estate Professional";

/**
 * Resolves the canonical site URL for metadata, sitemap.xml, robots.txt, and
 * absolute OG image URLs. Set NEXT_PUBLIC_SITE_URL once a custom domain is
 * live; until then this falls back to the Vercel-assigned deployment URL so
 * SEO tags are still correct in preview/production.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// Used by the admin dashboard's "View Site" link.
export const PUBLIC_SITE_URL = getSiteUrl();
