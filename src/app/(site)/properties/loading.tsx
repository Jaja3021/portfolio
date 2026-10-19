import { PropertyGridSkeleton } from "@/components/properties/PropertyCardSkeleton";

export default function Loading() {
  return (
    <section className="bg-background" aria-busy="true" aria-label="Loading properties">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4">
          <div className="h-3 w-32 animate-pulse rounded bg-background-secondary" />
          <div className="h-9 w-72 animate-pulse rounded bg-background-secondary" />
        </div>
        <div className="mb-10 h-40 animate-pulse rounded-xl bg-background-secondary" />
        <PropertyGridSkeleton />
      </div>
    </section>
  );
}
