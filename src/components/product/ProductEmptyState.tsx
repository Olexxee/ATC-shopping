interface ProductEmptyStateProps {
  title?: string;
  description?: string;
}

export function ProductEmptyState({
  title = "No products found",
  description = "Try adjusting your filters or search.",
}: ProductEmptyStateProps) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 px-6 text-center">
      <div>
        <h2 className="text-base font-semibold text-neutral-950">{title}</h2>

        <p className="mt-2 text-sm text-neutral-500">{description}</p>
      </div>
    </div>
  );
}
