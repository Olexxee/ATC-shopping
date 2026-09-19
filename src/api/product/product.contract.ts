export interface PriceRange {
  min: number;
  max: number;
}

export interface StorefrontCardVariant {
  id: string;
  color: string | null;
  size: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  image: string | null;
  isActive: boolean;
}

export interface StorefrontCard {
  id: string;
  slug: string;
  name: string;

  brand: string | null;
  category: string | null;
  image: string | null;

  priceRange: PriceRange;
  avgRating: number;
  totalReviews: number;

  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;

  variants: StorefrontCardVariant[];
  colors: string[];
  sizes: string[];
}

export interface StorefrontDetailVariant {
  id: string;
  sku: string | null;
  color: string | null;
  size: string | null;

  price: number;
  compareAtPrice: number | null;
  stock: number;

  weight: number;
  actualWeight: number;
  length: number | null;
  width: number | null;
  height: number | null;

  fulfillmentType: string;
  shippingType: string;

  isActive: boolean;
  attributes: Record<string, unknown>;

  media: Array<{
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

/**
 * Storefront detail has richer brand/category (with slug) for
 * breadcrumbs and outbound links. It does NOT extend StorefrontCard
 * because the shapes genuinely differ.
 */
export interface StorefrontDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;

  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  collection: { name: string; slug: string } | null;

  image: string | null;

  priceRange: PriceRange;
  avgRating: number;
  totalReviews: number;

  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;

  variants: StorefrontDetailVariant[];
  related: StorefrontCard[];
}

export interface AdminListRow {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  category: string | null;
  brand: string | null;
  variantCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminVariant {
  id: string;
  productId: string;

  sku: string | null;
  color: string | null;
  size: string | null;

  price: number;
  compareAtPrice: number | null;
  stock: number;

  weight: number;
  actualWeight: number;
  length: number | null;
  width: number | null;
  height: number | null;

  fulfillmentType: string;
  shippingType: string;

  isActive: boolean;

  attributes: Record<string, unknown>;
  metadata: Record<string, unknown>;

  media: Array<{
    id: string;
    url: string;
    publicId: string;
    alt: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }>;

  createdAt: string;
  updatedAt: string;
}

export interface AdminProductDetail {
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
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";

  metadata: Record<string, unknown>;

  variants: AdminVariant[];

  createdAt: string;
  updatedAt: string;
}
