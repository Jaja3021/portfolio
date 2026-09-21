"use client";

import { useFilters } from "@/context/FilterContext";
import { PH_LOCATIONS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LocationsSection() {
  const { filterByProvince } = useFilters();

  return (
    <section className="bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nationwide"
          title="Properties Across the Philippines"
          description="Explore opportunities organized by island group — click a province to see available listings."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {PH_LOCATIONS.map((group) => (
            <div key={group.region} className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-lg font-semibold text-foreground">{group.region}</h3>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.provinces.map((province) => (
                  <button
                    key={province}
                    type="button"
                    onClick={() => filterByProvince(province)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  >
                    {province}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
