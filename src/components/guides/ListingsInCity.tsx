import { MapPinIcon as MapPin } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { NoPhoto } from "@/components/properties/NoPhoto";
import { getProperties } from "@/lib/data";
import { estimateMonthlyFrom } from "@/lib/financing";
import { propertyPath } from "@/lib/property-url";
import { formatPrice, locationKey } from "@/lib/utils";

/** Live list of current (unsold) listings in a city, for use inside guide articles. */
export async function ListingsInCity({ city, limit = 6 }: { city: string; limit?: number }) {
  const listings = (await getProperties())
    .filter((p) => p.status !== "Sold" && locationKey(p.city) === locationKey(city))
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);

  if (listings.length === 0) {
    return (
      <p className="my-6 rounded-lg bg-background-secondary px-4 py-3 text-sm text-muted">
        No listings in {city} right now. <Link href="/contact" className="font-medium text-primary">Message me</Link>{" "}
        and I&apos;ll send you the latest available units.
      </p>
    );
  }

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {listings.map((p) => (
        <Link
          key={p.id}
          href={propertyPath(p)}
          className="flex gap-3 overflow-hidden rounded-xl border border-border bg-surface p-2 transition-colors hover:border-primary"
        >
          <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg">
            {p.images[0] ? (
              <Image src={p.images[0]} alt={p.title} fill sizes="112px" className="object-cover" />
            ) : (
              <NoPhoto />
            )}
          </div>
          <div className="min-w-0 py-1">
            <p className="line-clamp-2 text-sm font-semibold text-foreground">{p.title}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {p.city}, {p.province}
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">{formatPrice(p.price)}</p>
            {p.listingType !== "For Rent/Lease" && (
              <p className="text-xs text-muted">
                Est. from {formatPrice(Math.round(estimateMonthlyFrom(p.price)))}/month
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
