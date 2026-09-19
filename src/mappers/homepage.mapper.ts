import type { BrandCardData } from "../types/brand-ui";
import type { CategoryCardData } from "../types/category-ui";
import type { HeroSlideApi } from "../types/business-config";
import type { StorefrontCard } from "../api/product/product.contract";
import { mapHeroSlides } from "./hero.mapper";

function mapCategory(category: {
  id: string;
  name: string;
  slug: string;
  image?: { url: string } | null;
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
  _count?: { products: number };
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
  featured?: StorefrontCard[];
  newArrivals?: StorefrontCard[];
  bestSellers?: StorefrontCard[];
}

export function mapHomepage(source: HomepageSourceData) {
  return {
    hero: mapHeroSlides(source.hero ?? []),
    categories: (source.categories ?? []).map(mapCategory),
    brands: (source.brands ?? []).map(mapBrand),

    // Already StorefrontCard[] from the API — pass through.
    featuredProducts: source.featured ?? [],
    newArrivals: source.newArrivals ?? [],
    bestSellers: source.bestSellers ?? [],
  };
}
