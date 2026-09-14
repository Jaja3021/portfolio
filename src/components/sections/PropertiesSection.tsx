"use client";

import { MagnifyingGlassIcon as Search } from "@phosphor-icons/react/ssr";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyDetailModal } from "@/components/properties/PropertyDetailModal";
import { Button } from "@/components/ui/Button";
import { useFilters } from "@/context/FilterContext";
import { ALL_PROVINCES, BEDROOM_OPTIONS, PRICE_RANGES, PROPERTY_STATUSES, PROPERTY_TYPES, REGIONS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import { filterProperties, filtersAreActive } from "@/lib/utils";

const selectClass =
  "rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";

export function PropertiesSection({ properties }: { properties: Property[] }) {
  const { filters, setFilters, clearFilters } = useFilters();
  const [selected, setSelected] = useState<Property | null>(null);

  const results = useMemo(() => filterProperties(properties, filters), [properties, filters]);
  const active = filtersAreActive(filters);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mt-4 text-base text-foreground/60">
            Browse available listings or use the filters to narrow your search.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-border bg-muted p-5 sm:p-6">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search properties, cities, or provinces..."
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ propertyType: e.target.value as typeof filters.propertyType })}
              className={selectClass}
            >
              <option value="all">Property Type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({ region: e.target.value as typeof filters.region })}
              className={selectClass}
            >
              <option value="all">Location</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={filters.province}
              onChange={(e) => setFilters({ province: e.target.value })}
              className={selectClass}
            >
              <option value="all">Province</option>
              {ALL_PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ priceRange: e.target.value as typeof filters.priceRange })}
              className={selectClass}
            >
              <option value="all">Price Range</option>
              {PRICE_RANGES.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>

            <select
              value={filters.bedrooms}
              onChange={(e) =>
                setFilters({ bedrooms: e.target.value === "all" ? "all" : Number(e.target.value) })
              }
              className={selectClass}
            >
              <option value="all">Bedrooms</option>
              {BEDROOM_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}+ Bedrooms
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
              className={selectClass}
            >
              <option value="all">Status</option>
              {PROPERTY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {active && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {results.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground/60">
            No properties match your search. Try adjusting your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <div key={p.id} className="h-full">
                <PropertyCard property={p} onViewDetails={setSelected} />
              </div>
            ))}
          </div>
        )}
      </div>

      <PropertyDetailModal property={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
