import { Search, X } from "lucide-react";
import type { BrandFilters as BrandFilterValues } from "../brand.types";

interface BrandFiltersProps {
  filters: BrandFilterValues;
  onChange: (filters: BrandFilterValues) => void;
}

export function BrandFilters({ filters, onChange }: BrandFiltersProps) {
  const hasFilters = Boolean(filters.search || filters.isActive !== undefined);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_auto]">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={filters.search ?? ""}
            onChange={(event) =>
              onChange({
                ...filters,
                search: event.target.value,
              })
            }
            placeholder="Search brands..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* Status */}
        <select
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(event) => {
            const value = event.target.value;

            onChange({
              ...filters,
              isActive: value === "" ? undefined : value === "true",
            });
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Clear */}
        <button
          type="button"
          disabled={!hasFilters}
          onClick={() =>
            onChange({
              page: 1,
              limit: filters.limit ?? 20,
            })
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={15} />
          Clear
        </button>
      </div>
    </div>
  );
}
