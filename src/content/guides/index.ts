// Registry of /guides articles. Each entry's body lives in ./<slug>.mdx.
//
// To publish a draft: review the article, then set `draft: false` (and update
// `updatedAt`). Drafts are hidden from the /guides list and the sitemap on the
// live site and marked noindex, but can still be opened by direct URL for review.

export interface Guide {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-10-16". */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  draft: boolean;
}

export const GUIDES: Guide[] = [
  {
    slug: "rfo-vs-pre-selling",
    title: "RFO vs Pre-Selling: Which Is Better?",
    description:
      "Ready-for-occupancy or pre-selling? Compare price, payment terms, risk, and move-in time to decide which fits your family or investment plans.",
    publishedAt: "2026-10-16",
    readingMinutes: 6,
    // TODO(Arnold): review, then set to false to publish.
    draft: true,
  },
  {
    slug: "pag-ibig-housing-loan-requirements",
    title: "Pag-IBIG Housing Loan Requirements",
    description:
      "Who can apply, the documents you need (including for OFWs), how much you can borrow, and the step-by-step process for a Pag-IBIG housing loan.",
    publishedAt: "2026-10-16",
    readingMinutes: 7,
    // TODO(Arnold): review, then set to false to publish.
    draft: true,
  },
  {
    slug: "affordable-house-and-lot-naic-cavite",
    title: "Affordable House and Lot in Naic, Cavite",
    description:
      "Why Naic is popular with first-time buyers and OFW families, what to look for in a subdivision, and current house and lot listings in Naic, Cavite.",
    publishedAt: "2026-10-16",
    readingMinutes: 5,
    // TODO(Arnold): review, then set to false to publish.
    draft: true,
  },
];

const SHOW_DRAFTS = process.env.NODE_ENV === "development";

/** Guides shown in the list and sitemap: published ones, plus drafts while developing. */
export function listedGuides(): Guide[] {
  return GUIDES.filter((g) => !g.draft || SHOW_DRAFTS).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function publishedGuides(): Guide[] {
  return GUIDES.filter((g) => !g.draft);
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
