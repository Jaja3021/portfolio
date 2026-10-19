"use client";

import {
  BathtubIcon as Bath,
  BedIcon as Bed,
  HeartIcon as Heart,
  RulerIcon as Ruler,
  SquareIcon as Square,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { NoPhoto } from "@/components/properties/NoPhoto";
import { StatusBadge } from "@/components/ui/Badge";
import { useFavorites } from "@/hooks/useFavorites";
import { estimateMonthly } from "@/lib/financing";
import { propertyPath } from "@/lib/property-url";
import type { Property } from "@/lib/types";
import { cardImage, formatPrice, propertySpecs, type SpecKind } from "@/lib/utils";

const SPEC_ICONS: Record<SpecKind, typeof Bed> = { bed: Bed, bath: Bath, lot: Ruler, floor: Square };

export const PROPERTY_CARD_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/**
 * Listing card. With `onViewDetails`, a plain click opens the quick-view
 * modal; otherwise (and for ctrl/cmd-click) it navigates to the detail page.
 */
export function PropertyCard({
  property,
  onViewDetails,
}: {
  property: Property;
  onViewDetails?: (property: Property) => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);
  const image = cardImage(property);
  const estimate =
    property.listingType !== "For Rent/Lease" && property.status !== "Sold" ? estimateMonthly(property.price) : null;
  const specs = propertySpecs(property);
  const href = propertyPath(property);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-secondary">
        {image ? (
          <Image src={image} alt={property.title} fill sizes={PROPERTY_CARD_SIZES} className="object-cover" />
        ) : (
          <NoPhoto />
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(property.id)}
          aria-pressed={favorited}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-surface p-2 shadow-sm"
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-primary text-primary" : "text-foreground/70"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
          {property.propertyType} · {property.city}, {property.province}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground">
          {/* The whole card is clickable via this link's ::after overlay. */}
          <Link
            href={href}
            onClick={(e) => {
              if (!onViewDetails || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
              e.preventDefault();
              onViewDetails(property);
            }}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {property.title}
          </Link>
        </h3>

        <div className="mb-4 mt-4">
          {estimate ? (
            <>
              <p className="text-xl font-semibold text-primary">
                From {formatPrice(Math.round(estimate.monthly))}
                <span className="text-sm font-medium">/mo</span>
              </p>
              <p className="mt-0.5 text-sm text-muted">TCP {formatPrice(property.price)}</p>
              <p className="mt-1 text-xs text-muted">{estimate.assumptions}</p>
            </>
          ) : (
            property.price > 0 && (
              <p className="text-xl font-semibold text-foreground">{formatPrice(property.price)}</p>
            )
          )}
        </div>

        {specs.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-4 text-sm text-foreground">
            {specs.map((s) => {
              const Icon = SPEC_ICONS[s.kind];
              return (
                <li key={s.kind} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                  {s.text}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </article>
  );
}
