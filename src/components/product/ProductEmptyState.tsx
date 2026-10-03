interface ProductEmptyStateProps {
  title?: string;
  description?: string;
}

export function ProductEmptyState({
  title = "No products found",
  description = "Try adjusting your filters or search.",
}: ProductEmptyStateProps) {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h2 className="text-base font-semibold leading-snug text-[var(--text-primary)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
