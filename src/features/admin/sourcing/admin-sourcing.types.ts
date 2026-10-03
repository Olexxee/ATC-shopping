// ============================================================
// ADMIN SOURCING TYPES
//
// Customer-facing types live in ../sourcing/sourcing.types.ts.
// Admin types are kept separate because the admin API returns
// extra fields (user, unfiltered responses) that customers
// never see.
// ============================================================

export type AdminSourcingRequestStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "RESPONDED"
  | "COMPLETED"
  | "DECLINED"
  | "CANCELLED";

export type AdminSourcingResponseStatus =
  | "PENDING"
  | "OFFERED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

// ============================================================
// AI
// ============================================================

export interface AdminSourcingAIAnalysis {
  productType: string | null;
  brand: string | null;
  possibleModel: string | null;
  category: string | null;
  attributes: Record<string, unknown>;
  searchTerms: string[];
  confidence: number;
}

// ============================================================
// REFERENCE IMAGES
// ============================================================

export interface AdminSourcingReferenceImage {
  url: string;
  publicId: string;
  mimeType: string;
  bytes: number;
  format: string | null;
  width: number | null;
  height: number | null;
}

// ============================================================
// CUSTOMER
//
// Backend mapper (sourcing.mapper.js → toSourcingRequest) emits
// `{ id, fullName, email, phone }` under the `user` key.
// ============================================================

export interface AdminSourcingUser {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
}

// ============================================================
// PRODUCT
// ============================================================

export interface AdminSourcingProductVariantMedia {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface AdminSourcingProductVariant {
  id: string;
  sku: string | null;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  media: AdminSourcingProductVariantMedia[];
}

export interface AdminSourcingProduct {
  id: string;
  name: string;
  slug: string;
  status: string;

  category: {
    id: string;
    name: string;
  } | null;

  brand: {
    id: string;
    name: string;
  } | null;

  variants: AdminSourcingProductVariant[];
}

// ============================================================
// RESPONSE
// ============================================================

export interface AdminSourcingResponse {
  id: string;

  message: string | null;

  status: AdminSourcingResponseStatus;

  expiresAt: string | null;

  product: AdminSourcingProduct | null;

  variant: AdminSourcingProductVariant | null;

  createdAt: string;
  updatedAt: string;
}

// ============================================================
// REQUEST
// ============================================================

export interface AdminSourcingRequest {
  id: string;
  requestNumber: string;

  title: string;
  description: string | null;
  referenceUrl: string | null;

  referenceImages: AdminSourcingReferenceImage[];

  status: AdminSourcingRequestStatus;

  aiAnalysis: AdminSourcingAIAnalysis | null;

  // Backend emits `user`, not `customer`.
  user: AdminSourcingUser | null;

  responses: AdminSourcingResponse[];

  createdAt: string;
  updatedAt: string;
}

// ============================================================
// LIST
// ============================================================

export interface AdminSourcingListParams {
  page?: number;
  limit?: number;
  status?: AdminSourcingRequestStatus;
}

export interface AdminSourcingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/*
 * Matches the backend envelope:
 *   { success, message, data: { requests, meta }, }
 *
 * The API layer unwraps `data` before returning, so consumers
 * receive this shape directly.
 */
export interface AdminSourcingListResponse {
  requests: AdminSourcingRequest[];
  meta: AdminSourcingPagination;
}

// ============================================================
// RESPONSE / PRODUCT ATTACHMENT  (Design B)
//
// The product is created first via the normal product pipeline
// (which handles image uploads). Then this endpoint links the
// existing product + variant to the sourcing request.
// ============================================================

export interface CreateAdminSourcingResponseInput {
  message?: string | null;
  expiresAt?: string | null;
  productId: string;
  variantId: string;
}
