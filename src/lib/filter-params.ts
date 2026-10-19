import { BEDROOM_OPTIONS, PRICE_RANGES, PROPERTY_STATUSES, PROPERTY_TYPES, REGIONS } from "./constants";
import type { FilterState, PropertyStatus, PropertyType, Region } from "./types";
import { DEFAULT_FILTERS, type SortKey, SORT_OPTIONS } from "./utils";

/**
 * /properties filters live in the URL so results can be shared and the back
 * button works, e.g. /properties?type=townhouse&province=cavite&budget=3m-5m
 */

/** "House & Lot" → "house-and-lot", "RFO" → "rfo". */
export function toParamSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fromSlug<T extends string>(options: readonly T[], slug: string | null): T | undefined {
  if (!slug) return undefined;
  return options.find((o) => toParamSlug(o) === slug.toLowerCase());
}

type ParamSource = { get(name: string): string | null };

export function filtersFromParams(params: ParamSource): FilterState {
  const beds = Number(params.get("beds"));
  const budget = params.get("budget");
  return {
    search: params.get("q") ?? "",
    propertyType: fromSlug<PropertyType>(PROPERTY_TYPES, params.get("type")) ?? "all",
    region: fromSlug<Region>(REGIONS, params.get("region")) ?? "all",
    province: params.get("province")?.trim() || "all",
    priceRange: PRICE_RANGES.find((r) => r.key === budget)?.key ?? "all",
    bedrooms: BEDROOM_OPTIONS.includes(beds) ? beds : "all",
    status: fromSlug<PropertyStatus>(PROPERTY_STATUSES, params.get("status")) ?? "all",
  };
}

export function sortFromParams(params: ParamSource): SortKey {
  const sort = params.get("sort");
  return SORT_OPTIONS.find((o) => o.key === sort)?.key ?? "newest";
}

/** Query string for a filter state (defaults are left out). */
export function filtersToQuery(filters: Partial<FilterState>, sort: SortKey = "newest"): string {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const q = new URLSearchParams();
  if (f.search.trim()) q.set("q", f.search.trim());
  if (f.propertyType !== "all") q.set("type", toParamSlug(f.propertyType));
  if (f.region !== "all") q.set("region", toParamSlug(f.region));
  if (f.province !== "all") q.set("province", f.province.toLowerCase());
  if (f.priceRange !== "all") q.set("budget", f.priceRange);
  if (f.bedrooms !== "all") q.set("beds", String(f.bedrooms));
  if (f.status !== "all") q.set("status", toParamSlug(f.status));
  if (sort !== "newest") q.set("sort", sort);
  return q.toString();
}

/** Link to /properties with the given filters applied. */
export function propertiesHref(filters: Partial<FilterState> = {}): string {
  const query = filtersToQuery(filters);
  return query ? `/properties?${query}` : "/properties";
}
