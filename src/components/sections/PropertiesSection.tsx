"use client";

import { MagnifyingGlassIcon as Search } from "@phosphor-icons/react/ssr";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyDetailModal } from "@/components/properties/PropertyDetailModal";
import { Button } from "@/components/ui/Button";
import { useFilters } from "@/context/FilterContext";
import { BEDROOM_OPTIONS, PRICE_RANGES, PROPERTY_STATUSES, PROPERTY_TYPES, REGIONS } from "@/lib/constants";
import type { Property } from "@/lib/types";
import {
  SORT_OPTIONS,
  countByOption,
  filterProperties,
  filtersAreActive,
  provincesWithListings,
  sortProperties,
  type SortKey,
} from "@/lib/utils";

const selectClass =
  "rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

export function PropertiesSection({
  properties,
  initialPropertyId = null,
}: {
  properties: Property[];
  initialPropertyId?: string | null;
}) {
  const { filters, setFilters, clearFilters } = useFilters();
  // A shared link (/properties?property=<id>) opens straight into that listing.
  const [selected, setSelected] = useState<Property | null>(
    () => properties.find((p) => p.id === initialPropertyId) ?? null,
  );

  const closeDetails = () => {
    setSelected(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has("property")) {
      url.searchParams.delete("property");
      window.history.replaceState(window.history.state, "", url);
    }
  };

  const [sort, setSort] = useState<SortKey>("newest");

  // Sold listings live in the homepage "Recently Sold" section, not the browse grid
  // (a shared link to one still opens it, since `selected` searches all properties).
  const available = useMemo(() => properties.filter((p) => p.status !== "Sold"), [properties]);
  const results = useMemo(
    () => sortProperties(filterProperties(available, filters), sort),
    [available, filters, sort],
  );
  const active = filtersAreActive(filters);

  // Only provinces that have listings; keep a preselected one (e.g. from /locations) selectable.
  const provinces = useMemo(() => {
    const list = provincesWithListings(available);
    const selectedProvince = filters.province;
    if (selectedProvince !== "all" && !list.some((p) => p.toLowerCase() === selectedProvince.toLowerCase())) {
      list.push(selectedProvince);
    }
    return list;
  }, [available, filters.province]);

  // Per-option counts given the other active filters; empty options are disabled.
  const counts = useMemo(
    () => ({
      propertyType: countByOption(available, filters, "propertyType", PROPERTY_TYPES),
      region: countByOption(available, filters, "region", REGIONS),
      province: countByOption(available, filters, "province", provinces),
      priceRange: countByOption(available, filters, "priceRange", PRICE_RANGES.map((r) => r.key)),
      bedrooms: countByOption(available, filters, "bedrooms", BEDROOM_OPTIONS),
      status: countByOption(available, filters, "status", PROPERTY_STATUSES),
    }),
    [available, filters, provinces],
  );

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Property Collection
          </p>
          <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Browse available listings or use the filters to narrow your search.
          </p>
        </div>

        <div className="mb-10 rounded-xl border border-border bg-background-secondary p-5 sm:p-6">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search properties, cities, or provinces..."
              className="w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
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
                <CountedOption key={t} value={t} label={t} count={counts.propertyType.get(t)} selected={filters.propertyType === t} />
              ))}
            </select>

            <select
              value={filters.region}
              onChange={(e) => setFilters({ region: e.target.value as typeof filters.region })}
              className={selectClass}
            >
              <option value="all">Location</option>
              {REGIONS.map((r) => (
                <CountedOption key={r} value={r} label={r} count={counts.region.get(r)} selected={filters.region === r} />
              ))}
            </select>

            <select
              value={filters.province}
              onChange={(e) => setFilters({ province: e.target.value })}
              className={selectClass}
            >
              <option value="all">Province</option>
              {provinces.map((p) => (
                <CountedOption key={p} value={p} label={p} count={counts.province.get(p)} selected={filters.province === p} />
              ))}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ priceRange: e.target.value as typeof filters.priceRange })}
              className={selectClass}
            >
              <option value="all">Price Range</option>
              {PRICE_RANGES.map((r) => (
                <CountedOption
                  key={r.key}
                  value={r.key}
                  label={r.label}
                  count={counts.priceRange.get(r.key)}
                  selected={filters.priceRange === r.key}
                />
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
                <CountedOption key={b} value={b} label={`${b}+ Bedrooms`} count={counts.bedrooms.get(b)} selected={filters.bedrooms === b} />
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as typeof filters.status })}
              className={selectClass}
            >
              <option value="all">Status</option>
              {PROPERTY_STATUSES.map((s) => (
                <CountedOption key={s} value={s} label={s} count={counts.status.get(s)} selected={filters.status === s} />
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

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "property" : "properties"}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
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

      <PropertyDetailModal property={selected} onClose={closeDetails} />
    </section>
  );
}

function CountedOption({
  value,
  label,
  count = 0,
  selected,
}: {
  value: string | number;
  label: string;
  count?: number;
  selected: boolean;
}) {
  return (
    <option value={value} disabled={count === 0 && !selected}>
      {label} ({count})
    </option>
  );
}
