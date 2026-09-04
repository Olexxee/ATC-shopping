import { Search, X } from "lucide-react";
import type {
  CategoryFilters as CategoryFilterState,
  CategoryType,
} from "../category.types";

interface CategoryFiltersProps {
  filters: CategoryFilterState;
  onChange: (filters: CategoryFilterState) => void;
}

export function CategoryFilters({ filters, onChange }: CategoryFiltersProps) {
  const hasFilters =
    Boolean(filters.search) ||
    Boolean(filters.type) ||
    filters.isActive !== undefined;

  const update = (value: Partial<CategoryFilterState>) => {
    onChange({
      ...filters,
      ...value,
      page: 1,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={filters.search ?? ""}
            onChange={(event) =>
              update({
                search: event.target.value,
              })
            }
            placeholder="Search categories..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        <select
          value={filters.type ?? ""}
          onChange={(event) =>
            update({
              type: event.target.value
                ? (event.target.value as CategoryType)
                : undefined,
            })
          }
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-900"
        >
          <option value="">All types</option>
          <option value="PRODUCT">Product</option>
          <option value="SERVICE">Service</option>
          <option value="CONTENT">Content</option>
        </select>

        <select
          value={
            filters.isActive === undefined
              ? ""
              : filters.isActive
                ? "true"
                : "false"
          }
          onChange={(event) => {
            const value = event.target.value;

            update({
              isActive: value === "" ? undefined : value === "true",
            });
          }}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-900"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              onChange({
                page: 1,
                limit: filters.limit ?? 20,
              })
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
