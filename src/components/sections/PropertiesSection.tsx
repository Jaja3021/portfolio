"use client";

import { MessengerLogoIcon as Messenger, MagnifyingGlassIcon as Search } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyDetailModal } from "@/components/properties/PropertyDetailModal";
import { SITE_CONFIG } from "@/config/site";
import { BEDROOM_OPTIONS, PRICE_RANGES, PROPERTY_STATUSES, PROPERTY_TYPES, REGIONS } from "@/lib/constants";
import { filtersFromParams, filtersToQuery, sortFromParams } from "@/lib/filter-params";
import type { FilterState, Property } from "@/lib/types";
import {
  SORT_OPTIONS,
  countByOption,
  filterProperties,
  filtersAreActive,
  locationKey,
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
  // Filters are read from and written to the URL (shareable, back button works).
  // pushState/replaceState update useSearchParams without a server round trip.
  const searchParams = useSearchParams();
  const filters = filtersFromParams(searchParams);
  const sort = sortFromParams(searchParams);

  const writeUrl = (next: FilterState, nextSort: SortKey, mode: "push" | "replace") => {
    const params = new URLSearchParams(filtersToQuery(next, nextSort));
    const sharedId = searchParams.get("property");
    if (sharedId) params.set("property", sharedId);
    const query = params.toString();
    const url = query ? `?${query}` : window.location.pathname;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };
  const setFilters = (patch: Partial<FilterState>) => writeUrl({ ...filters, ...patch }, sort, "push");
  const setSort = (next: SortKey) => writeUrl(filters, next, "replace");

  // The search box keeps its own text so typing isn't slowed by URL updates;
  // it re-syncs when the URL changes from outside (back button, Clear filters).
  const [searchText, setSearchText] = useState(filters.search);
  const [syncedSearch, setSyncedSearch] = useState(filters.search);
  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    setSearchText(filters.search);
  }
  const onSearch = (value: string) => {
    setSearchText(value);
    setSyncedSearch(value);
    writeUrl({ ...filters, search: value }, sort, "replace");
  };

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

  // Sold listings live in the homepage "Recently Sold" section, not the browse grid
  // (a shared link to one still opens it, since `selected` searches all properties).
  const available = useMemo(() => properties.filter((p) => p.status !== "Sold"), [properties]);
  const results = sortProperties(filterProperties(available, filters), sort);
  const active = filtersAreActive(filters);

  // Only provinces that have listings; keep a preselected one (e.g. from /locations) selectable.
  // The URL holds the lowercase name, so match it back to the displayed spelling.
  const provinces = provincesWithListings(available);
  const provinceValue =
    filters.province === "all"
      ? "all"
      : (provinces.find((p) => locationKey(p) === locationKey(filters.province)) ?? filters.province);
  const provinceOptions =
    provinceValue === "all" || provinces.includes(provinceValue) ? provinces : [...provinces, provinceValue];

  // Per-option counts given the other active filters; empty options are disabled.
  const counts = {
    propertyType: countByOption(available, filters, "propertyType", PROPERTY_TYPES),
    region: countByOption(available, filters, "region", REGIONS),
    province: countByOption(available, filters, "province", provinceOptions),
    priceRange: countByOption(available, filters, "priceRange", PRICE_RANGES.map((r) => r.key)),
    bedrooms: countByOption(available, filters, "bedrooms", BEDROOM_OPTIONS),
    status: countByOption(available, filters, "status", PROPERTY_STATUSES),
  };

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            Property Collection
          </p>
          <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Properties for Sale
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Browse available listings or use the filters to narrow your search.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Property type">
          {(["all", ...PROPERTY_TYPES] as const).map((t) => {
            const isSelected = filters.propertyType === t;
            const count = t === "all" ? null : (counts.propertyType.get(t) ?? 0);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={isSelected}
                disabled={count === 0 && !isSelected}
                onClick={() => setFilters({ propertyType: t })}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {t === "all" ? "All types" : `${t} (${count})`}
              </button>
            );
          })}
        </div>

        <div className="mb-10 rounded-xl border border-border bg-background-secondary p-5 sm:p-6">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              type="search"
              aria-label="Search properties"
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search properties, cities, or provinces..."
              className="w-full rounded-lg border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <select
              value={filters.region}
              aria-label="Region"
              onChange={(e) => setFilters({ region: e.target.value as FilterState["region"] })}
              className={selectClass}
            >
              <option value="all">Region</option>
              {REGIONS.map((r) => (
                <CountedOption key={r} value={r} label={r} count={counts.region.get(r)} selected={filters.region === r} />
              ))}
            </select>

            <select
              value={provinceValue}
              aria-label="Province"
              onChange={(e) => setFilters({ province: e.target.value })}
              className={selectClass}
            >
              <option value="all">Province</option>
              {provinceOptions.map((p) => (
                <CountedOption key={p} value={p} label={p} count={counts.province.get(p)} selected={provinceValue === p} />
              ))}
            </select>

            <select
              value={filters.priceRange}
              aria-label="Budget"
              onChange={(e) => setFilters({ priceRange: e.target.value as FilterState["priceRange"] })}
              className={selectClass}
            >
              <option value="all">Budget</option>
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
              aria-label="Bedrooms"
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
              aria-label="Status"
              onChange={(e) => setFilters({ status: e.target.value as FilterState["status"] })}
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
              <Link href="/properties" className="text-sm font-medium text-primary underline-offset-2 hover:underline">
                Clear filters
              </Link>
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
          <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-xl border border-dashed border-border px-6 py-14 text-center">
            <p className="text-base text-foreground">
              No properties match yet — message Arnold, he may have unlisted units that fit.
            </p>
            <a
              href={SITE_CONFIG.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              <Messenger className="h-5 w-5" weight="fill" />
              Message on Messenger
            </a>
            <Link href="/properties" className="text-sm font-medium text-primary underline-offset-2 hover:underline">
              Clear filters
            </Link>
          </div>
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
