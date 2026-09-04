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
      <span className="hidden text-sm text-neutral-500 sm:inline">Sort by</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as ProductSortValue)}
        className="
          h-10
          rounded-full
          border
          border-neutral-200
          bg-white
          px-4
          text-sm
          font-medium
          text-neutral-900
          outline-none
          transition
          hover:border-neutral-400
          focus:border-neutral-900
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
