import { Link } from "react-router-dom";

import type { BrandCardData } from "../../types/brand-ui";

interface BrandCardProps {
  brand: BrandCardData;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      to={`/brands/${brand.slug}`}
      className="
        group
        flex
        h-28
        flex-col
        items-center
        justify-center
        gap-3
        border-b
        border-r
        border-neutral-200
        px-6
        transition-colors
        hover:bg-neutral-50
        sm:h-32
      "
    >
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          loading="lazy"
          className="
            h-10
            w-10
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      ) : (
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-neutral-100
            text-sm
            font-semibold
            text-neutral-700
          "
        >
          {brand.name.charAt(0).toUpperCase()}
        </div>
      )}

      <span className="text-sm font-medium text-neutral-900">{brand.name}</span>
    </Link>
  );
}
