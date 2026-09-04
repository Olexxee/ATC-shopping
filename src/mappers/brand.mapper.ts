import type { BrandApi } from "../features/brands/brands.types";
import type { BrandCardData } from "../types/brand-ui";

export function mapBrandToCard(brand: BrandApi): BrandCardData {
  const primaryMedia = brand.media.find((m) => m.isPrimary) ?? brand.media[0];

  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: primaryMedia?.url,
    description: brand.description ?? undefined,
    productCount: brand._count?.products,
  };
}

export function mapBrandsToCards(brands: BrandApi[]): BrandCardData[] {
  return brands.map(mapBrandToCard);
}
