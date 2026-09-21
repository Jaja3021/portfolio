"use client";

import { useFilters } from "@/context/FilterContext";
import { Button } from "@/components/ui/Button";
import { PH_LOCATIONS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LocationExplorer() {
  const { filterByRegion } = useFilters();

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title="Explore Properties by Location" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PH_LOCATIONS.map((group) => (
            <div
              key={group.region}
              className="flex flex-col justify-between rounded-xl border border-border bg-background-secondary p-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">{group.region}</h3>
                <p className="mt-2 text-sm text-muted">{group.description}</p>
              </div>
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => filterByRegion(group.region)}
              >
                Explore {group.region}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
