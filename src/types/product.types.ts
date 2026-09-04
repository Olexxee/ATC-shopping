export interface ProductMedia {
  id: string;
  variantId: string;
  url: string;
  publicId: string;
  mimeType: string;
  width: number | null;
  height: number | null;
  bytes: number;
  format: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  rating: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;

  color: string | null;
  size: string | null;

  weight: string;
  price: string;
  compareAtPrice: string | null;

  stock: number;

  fulfillmentType: "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

  length: string | null;
  width: string | null;
  height: string | null;

  actualWeight: string;

  shippingType: "LOCAL" | "IMPORT" | "SEA" | "AIR";

  isActive: boolean;

  attributes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;

  media: ProductMedia[];
  reviews: ProductReview[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;

  brandId: string | null;
  categoryId: string;
  collectionId: string | null;

  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;

  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  metadata: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;

  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  collection: {
    id: string;
    name: string;
    slug: string;
  } | null;

  variants: ProductVariant[];

  avgRating: number;
  totalReviews: number;

  priceRange: {
    min: number | null;
    max: number | null;
  } | null;
}
