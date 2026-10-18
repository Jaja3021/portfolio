import type { Property, FilterState } from "./types";
import { ALL_PROVINCES, PRICE_RANGES } from "./constants";

export function formatPrice(price: number): string {
  return `₱${price.toLocaleString("en-PH")}`;
}

export function formatArea(area: number | null, unit: string): string | null {
  if (area === null) return null;
  return `${area.toLocaleString("en-PH")} ${unit}`;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  propertyType: "all",
  region: "all",
  province: "all",
  priceRange: "all",
  bedrooms: "all",
  status: "all",
};

export function filtersAreActive(filters: FilterState): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.propertyType !== "all" ||
    filters.region !== "all" ||
    filters.province !== "all" ||
    filters.priceRange !== "all" ||
    filters.bedrooms !== "all" ||
    filters.status !== "all"
  );
}

/** Case/accent-insensitive key, so "CAVITE", "Cavite" and "cavite " match. */
export function locationKey(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function filterProperties(properties: Property[], filters: FilterState): Property[] {
  const term = filters.search.trim().toLowerCase();

  return properties.filter((p) => {
    if (
      term &&
      !p.title.toLowerCase().includes(term) &&
      !p.city.toLowerCase().includes(term) &&
      !p.province.toLowerCase().includes(term)
    ) {
      return false;
    }
    if (filters.propertyType !== "all" && p.propertyType !== filters.propertyType) return false;
    if (filters.region !== "all" && p.region !== filters.region) return false;
    if (filters.province !== "all" && locationKey(p.province) !== locationKey(filters.province)) return false;
    if (filters.status !== "all" && p.status !== filters.status) return false;
    if (filters.bedrooms !== "all" && (p.bedrooms ?? 0) < filters.bedrooms) return false;
    if (filters.priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.key === filters.priceRange);
      if (range && (p.price < range.min || p.price >= range.max)) return false;
    }
    return true;
  });
}

/** "Studio" for 0 bedrooms; otherwise "2 Bed" (short) or "2 Bedrooms" (long). */
export function bedroomLabel(bedrooms: number, style: "short" | "long" = "short"): string {
  if (bedrooms === 0) return "Studio";
  if (style === "short") return `${bedrooms} Bed`;
  return `${bedrooms} Bedroom${bedrooms === 1 ? "" : "s"}`;
}

/** Condos are sold by floor area; their lot area (if any) isn't meaningful to buyers. */
export function showsLotArea(property: Pick<Property, "propertyType" | "lotArea">): boolean {
  return property.propertyType !== "Condominium" && property.lotArea !== null;
}

export type SortKey = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Lowest price" },
  { key: "price-desc", label: "Highest price" },
];

export function sortProperties(properties: Property[], sort: SortKey): Property[] {
  const sorted = [...properties];
  if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
  else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sorted;
}

/**
 * How many listings each option of `key` would show, given the other active
 * filters. Lets the filter dropdowns show counts and disable empty options.
 */
export function countByOption<K extends keyof FilterState>(
  properties: Property[],
  filters: FilterState,
  key: K,
  options: readonly FilterState[K][],
): Map<FilterState[K], number> {
  return new Map(options.map((o) => [o, filterProperties(properties, { ...filters, [key]: o }).length]));
}

/**
 * Provinces that actually have listings, using the site's spelling where one
 * exists (so "CAVITE" in the data shows as "Cavite").
 */
export function provincesWithListings(properties: Property[]): string[] {
  const canonical = new Map(ALL_PROVINCES.map((p) => [locationKey(p), p]));
  const found = new Map<string, string>();
  for (const p of properties) {
    const key = locationKey(p.province);
    if (key && !found.has(key)) found.set(key, canonical.get(key) ?? toTitleCase(p.province.trim()));
  }
  return [...found.values()].sort((a, b) => a.localeCompare(b));
}

function toTitleCase(value: string): string {
  return value.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
