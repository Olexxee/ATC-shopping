export interface WishlistBrand {
  id: string;
  name: string;
  slug: string;
}

export interface WishlistCategory {
  id: string;
  name: string;
  slug: string;
}

export interface WishlistMedia {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

// A single representative active variant, included purely for display
// (thumbnail + a price to show) — Product itself has no images of its
// own. This is NOT "the variant that was wishlisted"; wishlist items are
// product-scoped now, there's no variant tie-in anymore.
export interface WishlistDisplayVariant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  media: WishlistMedia[];
}

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  brand: WishlistBrand | null;
  category: WishlistCategory | null;
  variants: WishlistDisplayVariant[];
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct | null;
}

export interface WishlistPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WishlistListResult {
  data: WishlistItem[];
  meta: WishlistPaginationMeta;
}

export interface WishlistListParams {
  page?: number;
  limit?: number;
}

export interface AddToWishlistPayload {
  productId: string;
}

// Keyed by productId
export type BatchWishlistCheckResult = Record<string, boolean>;
