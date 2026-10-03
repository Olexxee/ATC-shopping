import { SlidersHorizontal, X } from "lucide-react";
import type {
  ProductListingState,
  ProductSortValue,
} from "../../features/products/products-listing.utils";
import { ProductSort } from "./ProductSort";

interface ProductToolbarProps {
  resultCount: number;
  state: ProductListingState;
  onSortChange: (sort: ProductSortValue) => void;
  onFiltersOpen: () => void;
  onClearFilters?: () => void;
  showFilterButton?: boolean;
}

export function ProductToolbar({
  resultCount,
  state,
  onSortChange,
  onFiltersOpen,
  onClearFilters,
  showFilterButton = true,
}: ProductToolbarProps) {
  const hasFilters =
    Boolean(state.search) ||
    Boolean(state.categoryId) ||
    Boolean(state.brandId) ||
    Boolean(state.collectionId) ||
    Boolean(state.isFeatured) ||
    Boolean(state.isNew) ||
    Boolean(state.isBestSeller) ||
    state.minPrice !== undefined ||
    state.maxPrice !== undefined;

  return (
    <div className="space-y-3">
      <div
        className="
          flex
          min-h-14
          items-center
          justify-between
          gap-4
          border-y
          border-[var(--border)]
          py-3
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {showFilterButton && (
            <button
              type="button"
              onClick={onFiltersOpen}
              className="
                inline-flex
                h-10
                shrink-0
                items-center
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
                hover:text-[var(--brand)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
                lg:hidden
              "
            >
              <SlidersHorizontal size={16} strokeWidth={1.8} />
              Filters
            </button>
          )}

          <p className="truncate text-sm text-[var(--text-secondary)]">
            <span className="font-medium text-[var(--text-primary)]">
              {resultCount.toLocaleString()}
            </span>{" "}
            {resultCount === 1 ? "product" : "products"}
          </p>
        </div>

        <ProductSort
          value={state.sort}
          onChange={onSortChange}
        />
      </div>

      {hasFilters && onClearFilters && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            Filters applied
          </p>

          <button
            type="button"
            onClick={onClearFilters}
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-medium
              text-[var(--text-secondary)]
              transition-colors
              duration-200
              hover:text-[var(--brand)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
              focus-visible:ring-offset-2
            "
          >
            <X size={14} strokeWidth={1.8} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}