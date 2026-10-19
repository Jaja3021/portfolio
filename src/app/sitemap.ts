import type { MetadataRoute } from "next";
import { publishedGuides } from "@/content/guides";
import { getProperties } from "@/lib/data";
import { propertyPath } from "@/lib/property-url";
import { getSiteUrl } from "@/lib/site";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/properties", priority: 0.9, changeFrequency: "daily" },
  { path: "/ofw", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
  { path: "/requirements", priority: 0.7, changeFrequency: "monthly" },
  { path: "/calculator", priority: 0.7, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/book", priority: 0.6, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const properties = await getProperties();

  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Drafts are excluded until published (draft: false in src/content/guides/index.ts).
  const guides: MetadataRoute.Sitemap = publishedGuides().map((g) => ({
    url: `${siteUrl}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt ?? g.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const listings: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${siteUrl}${propertyPath(p)}`,
    lastModified: new Date(p.soldAt ?? p.createdAt),
    changeFrequency: p.status === "Sold" ? "yearly" : "weekly",
    priority: p.status === "Sold" ? 0.3 : p.featured ? 0.8 : 0.7,
    ...(p.images[0] && { images: [p.images[0]] }),
  }));

  return [...pages, ...guides, ...listings];
}
