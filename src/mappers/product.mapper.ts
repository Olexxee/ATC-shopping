import type { Product, ProductVariant } from "../types/product.types";
import type { ProductCardData, ProductCardVariant } from "../types/product-ui";

// ============================================================================
// VARIANT IMAGE
// ============================================================================

function getVariantImage(variant: ProductVariant): string | undefined {
  const media = variant.media ?? [];

  const primaryMedia = media.find((item) => item.isPrimary);

  return primaryMedia?.url ?? media[0]?.url;
}

// ============================================================================
// PRODUCT IMAGE
// ============================================================================

export function getProductImage(product: Product): string | undefined {
  const variants = product.variants ?? [];

  const allMedia = variants.flatMap((variant) => variant.media ?? []);

  const primaryMedia = allMedia.find((media) => media.isPrimary);

  if (primaryMedia?.url) {
    return primaryMedia.url;
  }

  for (const variant of variants) {
    const image = getVariantImage(variant);

    if (image) {
      return image;
    }
  }

  return undefined;
}

// ============================================================================
// PRODUCT PRICE
// ============================================================================

export function getProductPrice(product: Product): number {
  return Number(product.priceRange?.min ?? product.variants?.[0]?.price ?? 0);
}

// ============================================================================
// COMPARE-AT PRICE
// ============================================================================

export function getProductCompareAtPrice(product: Product): number | undefined {
  const variants = product.variants ?? [];

  const prices = variants
    .filter((variant) => variant.compareAtPrice != null)
    .map((variant) => ({
      price: Number(variant.price),
      compareAtPrice: Number(variant.compareAtPrice),
    }))
    .filter(({ price, compareAtPrice }) => compareAtPrice > price);

  if (!prices.length) {
    return undefined;
  }

  return Math.max(...prices.map(({ compareAtPrice }) => compareAtPrice));
}

// ============================================================================
// VARIANT MAPPER
// ============================================================================

function mapVariantToCardVariant(variant: ProductVariant): ProductCardVariant {
  return {
    id: variant.id,

    color: variant.color,

    size: variant.size,

    price: Number(variant.price),

    compareAtPrice:
      variant.compareAtPrice != null
        ? Number(variant.compareAtPrice)
        : undefined,

    stock: variant.stock,

    image: getVariantImage(variant),
  };
}

// ============================================================================
// PRODUCT MAPPER
// ============================================================================

export function mapProductToCard(product: Product): ProductCardData {
  const variants = product.variants ?? [];

  const cardVariants = variants.map(mapVariantToCardVariant);

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color)),
    ),
  ];

  const sizes = [
    ...new Set(
      variants
        .map((variant) => variant.size)
        .filter((size): size is string => Boolean(size)),
    ),
  ];

  return {
    id: product.id,

    name: product.name,

    slug: product.slug,

    brand: product.brand?.name,

    sku: variants[0]?.sku,

    price: getProductPrice(product),

    compareAtPrice: getProductCompareAtPrice(product),

    image: getProductImage(product),

    isNew: product.isNew,

    isFeatured: product.isFeatured,

    isBestSeller: product.isBestSeller,

    variants: cardVariants,

    hasVariants: cardVariants.length > 1,

    variantCount: cardVariants.length,

    colors,

    sizes,

  };
}
// ============================================================================
// COLLECTION MAPPER
// ============================================================================

export function mapProductsToCards(products: Product[]): ProductCardData[] {
  return products.map(mapProductToCard);
}
