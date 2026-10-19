/** Grey placeholder with the same shape as PropertyCard, shown while listings load. */
export function PropertyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface" aria-hidden>
      <div className="aspect-[4/3] w-full animate-pulse bg-background-secondary" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-background-secondary" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-background-secondary" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-background-secondary" />
        <div className="mt-2 h-6 w-2/5 animate-pulse rounded bg-background-secondary" />
        <div className="mt-auto flex gap-4 pt-4">
          <div className="h-4 w-14 animate-pulse rounded bg-background-secondary" />
          <div className="h-4 w-14 animate-pulse rounded bg-background-secondary" />
          <div className="h-4 w-16 animate-pulse rounded bg-background-secondary" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
