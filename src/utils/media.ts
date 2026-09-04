import type { Product, ProductMedia } from "../types/product.types";

export function getPrimaryMedia(
  media: ProductMedia[] = [],
): ProductMedia | undefined {
  return (
    media.find((item) => item.isPrimary) ??
    [...media].sort((a, b) => a.sortOrder - b.sortOrder)[0]
  );
}

export function getMediaUrl(media: ProductMedia[] = []): string | undefined {
  return getPrimaryMedia(media)?.url;
}

export function getProductImage(product: Product): string | undefined {
  const media = product.variants.flatMap((variant) => variant.media ?? []);

  return getMediaUrl(media);
}