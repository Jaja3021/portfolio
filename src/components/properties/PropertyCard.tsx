"use client";

import {
  BathtubIcon as Bath,
  BedIcon as BedDouble,
  HeartIcon as Heart,
  MapPinIcon as MapPin,
  RulerIcon as Ruler,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonArrow } from "@/components/ui/Button";
import { useFavorites } from "@/hooks/useFavorites";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/utils";

export function PropertyCard({
  property,
  onViewDetails,
}: {
  property: Property;
  onViewDetails: (property: Property) => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(property.id)}
          aria-pressed={favorited}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 rounded-full bg-surface/90 p-2 shadow-sm transition-colors hover:text-accent cursor-pointer"
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-accent text-accent" : "text-foreground/70"}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent">
            {property.propertyType}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{property.title}</h3>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPin className="h-4 w-4 text-primary" />
          {property.city}, {property.province}
        </p>

        <p className="text-xl font-semibold text-foreground">{formatPrice(property.price)}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {property.bedrooms !== null && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" /> {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" /> {property.bathrooms} Bath
            </span>
          )}
          {property.lotArea !== null && (
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4" /> {formatArea(property.lotArea, "sqm Lot")}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(property)}
          className="group/btn mt-auto flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-primary transition-colors hover:text-primary-hover cursor-pointer"
        >
          View Details
          <ButtonArrow />
        </button>
      </div>
    </div>
  );
}
