import Form from "next/form";
import { PRICE_RANGES, PROPERTY_TYPES } from "@/lib/constants";
import { toParamSlug } from "@/lib/filter-params";
import type { Property } from "@/lib/types";
import { DEFAULT_FILTERS, filterProperties, provincesWithListings } from "@/lib/utils";

const selectClass =
  "h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

/**
 * Type · Location · Budget search. Options only include values that have
 * listings. Submits as a GET to /properties, which reads the same params.
 */
export function QuickSearch({ properties }: { properties: Property[] }) {
  const types = PROPERTY_TYPES.filter((t) => properties.some((p) => p.propertyType === t));
  const provinces = provincesWithListings(properties);
  const budgets = PRICE_RANGES.filter(
    (r) => filterProperties(properties, { ...DEFAULT_FILTERS, priceRange: r.key }).length > 0,
  );

  return (
    <Form
      action="/properties"
      className="grid grid-cols-1 gap-2 rounded-xl border border-border bg-surface p-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
      aria-label="Search properties"
    >
      <label className="sr-only" htmlFor="qs-type">
        Property type
      </label>
      <select id="qs-type" name="type" defaultValue="" className={selectClass}>
        <option value="">Any property type</option>
        {types.map((t) => (
          <option key={t} value={toParamSlug(t)}>
            {t}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="qs-province">
        Location
      </label>
      <select id="qs-province" name="province" defaultValue="" className={selectClass}>
        <option value="">Any location</option>
        {provinces.map((p) => (
          <option key={p} value={p.toLowerCase()}>
            {p}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="qs-budget">
        Budget
      </label>
      <select id="qs-budget" name="budget" defaultValue="" className={selectClass}>
        <option value="">Any budget</option>
        {budgets.map((r) => (
          <option key={r.key} value={r.key}>
            {r.label}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="h-12 cursor-pointer rounded-lg bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover"
      >
        Search
      </button>
    </Form>
  );
}
