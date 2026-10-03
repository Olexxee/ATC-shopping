import { Link } from "react-router-dom";
import type { CategoryCardData } from "../../types/category-ui";

interface CategoryCardProps {
  category: CategoryCardData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="
        group
        block
        rounded-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--brand)]
        focus-visible:ring-offset-2
      "
    >
      <div
        className="
          relative
          aspect-[4/5]
          overflow-hidden
          rounded-xl
          bg-[var(--surface)]
        "
      >
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.03]
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              px-4
              text-center
              text-sm
              text-[var(--text-muted)]
            "
          >
            {category.name}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3
          className="
            text-sm
            font-medium
            leading-snug
            text-[var(--text-primary)]
            transition-colors
            duration-200
            group-hover:text-[var(--brand)]
          "
        >
          {category.name}
        </h3>

        {category.productCount !== undefined && (
          <p
            className="
              mt-1
              text-xs
              text-[var(--text-muted)]
            "
          >
            {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </Link>
  );
}
