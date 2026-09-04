export interface ProductCardVariant {
  id: string;

  color: string | null;

  size: string | null;

  price: number;

  compareAtPrice?: number;

  stock: number;

  image?: string;
}

export interface ProductCardData {
  id: string;

  name: string;

  slug: string;

  brand?: string;

  sku?: string;

  price: number;

  compareAtPrice?: number;

  image?: string;

  isNew?: boolean;

  isFeatured?: boolean;

  isBestSeller?: boolean;

  variants: ProductCardVariant[];

  hasVariants: boolean;

  variantCount: number;

  colors: string[];

  sizes: string[];
}
