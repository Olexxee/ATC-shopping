import {
  PRODUCT_SORT_OPTIONS,
  type ProductSortValue,
} from "../../features/products/products-listing.utils";

interface ProductSortProps {
  value: ProductSortValue;
  onChange: (value: ProductSortValue) => void;
  className?: string;
}

export function ProductSort({
  value,
  onChange,
  className = "",
}: ProductSortProps) {
  return (
    <label className={`flex items-center gap-3 ${className}`}>
      <span className="hidden text-sm text-[var(--text-muted)] sm:inline">
        Sort by
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ProductSortValue)}
        className="
          h-10
          min-w-36
          cursor-pointer
          appearance-none
          rounded-lg
          border
          border-[var(--border)]
          bg-white
          px-3
          text-sm
          font-medium
          text-[var(--text-primary)]
          outline-none
          transition-colors
          duration-200
          hover:border-[var(--border-strong)]
          focus:border-[var(--brand)]
          focus:ring-2
          focus:ring-[var(--brand-soft)]
        "
      >
        {PRODUCT_SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
