import { Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Loading                                                            */
/* ------------------------------------------------------------------ */

export function AdminSourcingSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse border-b border-neutral-100 px-4 py-4 last:border-0 sm:px-5"
        >
          <div className="flex gap-4">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100" />

            <div className="flex-1">
              <div className="h-4 w-1/2 rounded bg-neutral-100" />
              <div className="mt-2 h-3 w-28 rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty                                                              */
/* ------------------------------------------------------------------ */

export function AdminSourcingEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
        <Search size={21} />
      </div>

      <h2 className="mt-5 text-base font-semibold text-neutral-950">
        No sourcing requests
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
        There are no sourcing requests matching the selected filter.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Error                                                              */
/* ------------------------------------------------------------------ */

interface AdminSourcingErrorProps {
  onRetry: () => void;
}

export function AdminSourcingError({ onRetry }: AdminSourcingErrorProps) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
      <h2 className="text-base font-semibold text-neutral-950">
        Couldn't load sourcing requests
      </h2>

      <p className="mt-2 text-sm text-neutral-500">
        Something went wrong while loading the sourcing queue.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        Try again
      </button>
    </div>
  );
}
