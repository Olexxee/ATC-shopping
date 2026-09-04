import type { CategoryApi } from "../features/categories/categories.types";
import type { CategoryCardData } from "../types/category-ui";

export function mapCategoryToCard(category: CategoryApi): CategoryCardData {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image?.url,
    productCount: category.productCount,
  };
}

export function mapCategoriesToCards(
  categories: CategoryApi[],
): CategoryCardData[] {
  return categories.map(mapCategoryToCard);
}
