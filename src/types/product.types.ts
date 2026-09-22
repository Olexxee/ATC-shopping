export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductFulfillmentType =
  | "LOCAL"
  | "IMPORT"
  | "PREORDER"
  | "DIGITAL";

export type ProductShippingType =
  | "LOCAL"
  | "IMPORT"
  | "SEA"
  | "AIR"
  | "DIGITAL";

export interface ProductBrandMedia {
  id: string;
  url: string;
  publicId?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  media: ProductBrandMedia[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  type?: string;
}

export interface ProductCollection {
  id: string;
  name: string;
  slug: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  helpfulCount?: number;
  createdAt: string;
  user?: { id: string; fullName: string };
}

export interface ProductMedia {
  id: string;
  variantId: string;
  url: string;
  publicId: string;
  mimeType: string | null;
  bytes: number | null;
  format: string | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;

  sku: string | null;
  color: string | null;
  size: string | null;

  /** Prisma Decimal — serialized as string over JSON. */
  weight: number | string;
  price: number | string;
  compareAtPrice: number | string | null;
  stock: number;

  fulfillmentType: ProductFulfillmentType;

  length: number | string | null;
  width: number | string | null;
  height: number | string | null;

  actualWeight: number | string;

  shippingType: ProductShippingType;

  isActive: boolean;

  attributes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;

  media: ProductMedia[];
  reviews?: ProductReview[];
}

export interface ProductPriceRange {
  min: number | null;
  max: number | null;
}

export interface Product {
  images: any;
  id: string;
  name: string;
  slug: string;
  description: string | null;

  brandId: string | null;
  categoryId: string;
  collectionId: string | null;

  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;

  status: ProductStatus;

  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;

  brand: ProductBrand | null;
  category: ProductCategory;
  collection: ProductCollection | null;

  variants: ProductVariant[];

  _count?: { variants: number };

  /** Present only on list / card responses (productDb.addComputedFields). */
  avgRating?: number;
  totalReviews?: number;
  priceRange?: ProductPriceRange;
}
