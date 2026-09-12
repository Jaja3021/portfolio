"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { FilterState, PropertyType, Region } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/utils";

interface FilterContextValue {
  filters: FilterState;
  setFilters: (patch: Partial<FilterState>) => void;
  clearFilters: () => void;
  filterByType: (type: PropertyType) => void;
  filterByRegion: (region: Region) => void;
  filterByProvince: (province: string) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);

  const setFilters = useCallback((patch: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearFilters = useCallback(() => setFiltersState(DEFAULT_FILTERS), []);

  const filterByType = useCallback(
    (type: PropertyType) => {
      setFiltersState({ ...DEFAULT_FILTERS, propertyType: type });
      router.push("/properties");
    },
    [router]
  );

  const filterByRegion = useCallback(
    (region: Region) => {
      setFiltersState({ ...DEFAULT_FILTERS, region });
      router.push("/properties");
    },
    [router]
  );

  const filterByProvince = useCallback(
    (province: string) => {
      setFiltersState({ ...DEFAULT_FILTERS, province });
      router.push("/properties");
    },
    [router]
  );

  const value = useMemo(
    () => ({ filters, setFilters, clearFilters, filterByType, filterByRegion, filterByProvince }),
    [filters, setFilters, clearFilters, filterByType, filterByRegion, filterByProvince]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
}
