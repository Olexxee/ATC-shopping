export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-xl bg-[var(--surface)]" />

          {/* Product information */}
          <div className="mt-4 space-y-2">
            <div className="h-3 w-1/3 rounded bg-[var(--surface)]" />

            <div className="h-4 w-3/4 rounded bg-[var(--surface)]" />

            <div className="h-4 w-1/2 rounded bg-[var(--surface)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
