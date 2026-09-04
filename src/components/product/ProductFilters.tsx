import { SlidersHorizontal } from "lucide-react";

import {
  PRODUCT_SORT_OPTIONS,
} from "../../features/products/products-listing.utils";

type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number]["value"];

interface ProductToolbarProps {
  total: number;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  onFilterClick?: () => void;
}

export function ProductToolbar({
  total,
  sort,
  onSortChange,
  onFilterClick,
}: ProductToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-y border-neutral-200 py-4">
      <div>
        <p className="text-sm text-neutral-500">
          {total.toLocaleString()} products
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-400"
          >
            <SlidersHorizontal size={16} />
            Filter
          </button>
        )}

        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-neutral-500 sm:inline">Sort</span>

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as ProductSort)
            }
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-neutral-950"
          >
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
