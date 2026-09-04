import {
  useBestSellers,
  useFeaturedProducts,
  useNewArrivals,
} from "../products/products.queries";
import { useCategories } from "../categories/categories.queries";
import { useBrands } from "../brands/brands.queries";
import { useStorefrontConfig } from "../businessConfig/businessConfig.queries";



export function useHomepageData() {
  const featuredQuery = useFeaturedProducts({
    limit: 4,
  });

  const newArrivalsQuery = useNewArrivals({
    limit: 4,
  });

  const bestSellersQuery = useBestSellers({
    limit: 4,
  });

  const categoriesQuery = useCategories({
    type: "PRODUCT",
    isActive: true,
    limit: 8,
  });

  const brandsQuery = useBrands();

  const storefrontConfigQuery = useStorefrontConfig();

  return {
    hero: storefrontConfigQuery.data?.heroSlides ?? [],

    featured: featuredQuery.data ?? [],
    newArrivals: newArrivalsQuery.data ?? [],
    bestSellers: bestSellersQuery.data ?? [],

    categories: categoriesQuery.data?.data ?? [],
    brands: brandsQuery.data?.data ?? [],

    featuredQuery,
    newArrivalsQuery,
    bestSellersQuery,

    categoriesQuery,
    brandsQuery,

    storefrontConfigQuery,
  };
}
