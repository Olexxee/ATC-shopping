import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminSourcingPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function AdminSourcingPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: AdminSourcingPaginationProps) {
  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div className="mt-5 flex flex-col gap-4 border-t border-neutral-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        Showing{" "}
        <span className="font-medium text-neutral-700">
          {firstItem}–{lastItem}
        </span>{" "}
        of <span className="font-medium text-neutral-700">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-sm font-medium text-neutral-700">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
