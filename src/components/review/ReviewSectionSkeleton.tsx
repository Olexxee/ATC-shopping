// src/components/review/ReviewSectionSkeleton.tsx

export function ReviewSectionSkeleton() {
  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      <div className="animate-pulse">
        <div className="h-3 w-28 rounded bg-neutral-100" />

        <div className="mt-3 h-8 w-48 rounded bg-neutral-100" />

        <div className="mt-8 h-44 rounded-2xl bg-neutral-100" />

        <div className="mt-10 space-y-6">
          <div className="h-32 rounded-xl bg-neutral-100" />
          <div className="h-32 rounded-xl bg-neutral-100" />
        </div>
      </div>
    </section>
  );
}
