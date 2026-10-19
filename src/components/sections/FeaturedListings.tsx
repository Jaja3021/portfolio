import Link from "next/link";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Property } from "@/lib/types";

const COUNT = 6;

/**
 * Listings marked "featured" in the dashboard first, then topped up with the
 * newest RFO units, then the newest of the rest.
 */
export function pickFeatured(available: Property[]): Property[] {
  const newest = [...available].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const picked = newest.filter((p) => p.featured);
  for (const p of newest.filter((p) => !p.featured && p.status === "RFO")) picked.push(p);
  for (const p of newest.filter((p) => !p.featured && p.status !== "RFO")) picked.push(p);
  return picked.slice(0, COUNT);
}

/** @param properties listings still on the market (Sold removed). */
export function FeaturedListings({ properties }: { properties: Property[] }) {
  const listings = pickFeatured(properties);
  if (listings.length === 0) return null;

  return (
    <section id="featured" className="bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Featured listings
          </h2>
          <Link href="/properties" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            View all properties →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
