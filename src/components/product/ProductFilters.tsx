import { SlidersHorizontal } from "lucide-react";
import type { ProductSortValue } from "../../features/products/products-listing.utils";
import { ProductSort } from "./ProductSort";

interface ProductToolbarProps {
  total: number;
  sort: ProductSortValue;
  onSortChange: (sort: ProductSortValue) => void;
  onFilterClick?: () => void;
}

export function ProductToolbar({
  total,
  sort,
  onSortChange,
  onFilterClick,
}: ProductToolbarProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        border-y
        border-[var(--border)]
        py-3
        sm:py-4
      "
    >
      <p className="text-sm text-[var(--text-secondary)]">
        {total.toLocaleString()} products
      </p>

      <div className="flex items-center gap-2 sm:gap-3">
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="
              inline-flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--border)]
              bg-white
              px-3
              text-sm
              font-medium
              text-[var(--text-primary)]
              transition-colors
              duration-200
              hover:border-[var(--border-strong)]
              hover:bg-[var(--surface)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
              focus-visible:ring-offset-2
            "
          >
            <SlidersHorizontal size={16} strokeWidth={1.8} />
            <span>Filter</span>
          </button>
        )}

        <ProductSort value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
