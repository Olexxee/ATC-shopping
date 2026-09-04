import type { Product } from "../types/product.types";
import type { BrandCardData } from "../types/brand-ui";
import type { CategoryCardData } from "../types/category-ui";
import type { HomepageViewData } from "../types/homepage-ui";
import type { HeroSlideApi } from "../types/business-config";
import { mapProductsToCards } from "./product.mapper";
import { mapHeroSlides } from "./hero.mapper";

function mapCategory(category: {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  } | null;
  productCount?: number;
}): CategoryCardData {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image?.url,
    productCount: category.productCount,
  };
}

function mapBrand(brand: {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  _count?: {
    products: number;
  };
}): BrandCardData {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo ?? undefined,
    description: brand.description ?? undefined,
    productCount: brand._count?.products,
  };
}

interface HomepageSourceData {
  hero?: HeroSlideApi[];

  categories?: Parameters<typeof mapCategory>[0][];
  brands?: Parameters<typeof mapBrand>[0][];

  featured?: Product[];
  newArrivals?: Product[];
  bestSellers?: Product[];
}

export function mapHomepage(source: HomepageSourceData): HomepageViewData {
  return {
    hero: mapHeroSlides(source.hero ?? []),

    categories: (source.categories ?? []).map(mapCategory),

    brands: (source.brands ?? []).map(mapBrand),

    featuredProducts: mapProductsToCards(source.featured ?? []),

    newArrivals: mapProductsToCards(source.newArrivals ?? []),

    bestSellers: mapProductsToCards(source.bestSellers ?? []),
  };
}
