import { Link } from "react-router-dom";
import type { CategoryCardData } from "../../types/category-ui";
interface CategoryCardProps {
  category: CategoryCardData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
        {category.image ? (
          <>
            <img
              src={category.image}
              alt={category.name}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                ease-out
                group-hover:scale-105
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-black/0
                transition-colors
                duration-300
                group-hover:bg-black/10
              "
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-neutral-400">
            {category.name}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-neutral-950">
          {category.name}
        </h3>

        {category.productCount !== undefined && (
          <p className="mt-1 text-xs text-neutral-500">
            {category.productCount}{" "}
            {category.productCount === 1 ? "product" : "products"}
          </p>
        )}
      </div>
    </Link>
  );
}
