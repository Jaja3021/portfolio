import type { Property } from "@/lib/types";

/** "Liora Homes – Naic, Cavite" → "liora-homes-naic-cavite" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    // NFD splits "ñ" into "n" + a combining mark; dropping non-ASCII keeps the "n".
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Readable, stable URL: the title slug is cosmetic, the trailing ID identifies the listing. */
export function propertyPath(property: Pick<Property, "id" | "title">): string {
  const slug = slugify(property.title);
  return `/properties/${slug ? `${slug}-` : ""}${property.id}`;
}

/** Finds the listing a /properties/[slug] segment points to (by its trailing ID). */
export function findPropertyBySlug<T extends Pick<Property, "id">>(properties: T[], slug: string): T | undefined {
  const decoded = decodeURIComponent(slug);
  return properties.find((p) => decoded === p.id || decoded.endsWith(`-${p.id}`));
}
