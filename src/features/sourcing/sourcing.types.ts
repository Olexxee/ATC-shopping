export type SourcingRequestStatus =
  | "SUBMITTED"
  | "IN_REVIEW"
  | "RESPONDED"
  | "COMPLETED"
  | "DECLINED"
  | "CANCELLED";

export type SourcingResponseStatus =
  | "PENDING"
  | "OFFERED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED";

export type SourcingResultType = "CATALOG_MATCH" | "SOURCING_REQUEST";

export interface SourcingReferenceImage {
  url: string;
  publicId: string;
  mimeType: string;
  bytes: number;
  format: string | null;
  width: number | null;
  height: number | null;
}

export interface SourcingAIAnalysis {
  productType: string | null;
  brand: string | null;
  possibleModel: string | null;
  category: string | null;
  attributes: Record<string, unknown>;
  searchTerms: string[];
  confidence: number;
}

export interface SourcingProductReference {
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
  variants: Array<{
    id: string;
    sku: string | null;
    price: number;
    stock: number;
    isActive: boolean;
    media: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
      sortOrder: number;
    }>;
  }>;
}

export interface SourcingResponseProduct {
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
  variants: Array<{
    id: string;
    sku: string | null;
    price: number;
    stock: number;
    isActive: boolean;
    media: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
      sortOrder: number;
    }>;
  }>;
}

export interface SourcingResponseVariant {
  id: string;
  sku: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  media: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
}

export interface SourcingResponse {
  id: string;
  message: string | null;
  status: SourcingResponseStatus;
  expiresAt: string | null;
  product: SourcingResponseProduct | null;
  variant: SourcingResponseVariant | null;
  createdAt: string;
  updatedAt: string;
}

export interface SourcingRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string | null;
  referenceUrl: string | null;
  referenceImages: SourcingReferenceImage[];
  status: SourcingRequestStatus;
  aiAnalysis: SourcingAIAnalysis | null;
  responses: SourcingResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminSourcingUser {
  id: string;
  name: string | null;
  email: string | null;
}

export interface AdminSourcingRequest extends SourcingRequest {
  user: AdminSourcingUser | null;
}

export interface SourcingListParams {
  page?: number;
  limit?: number;
  status?: SourcingRequestStatus;
}

export interface CreateSourcingRequestInput {
  title: string;
  description?: string | null;
  referenceUrl?: string | null;
  referenceImages?: File[];
}

export interface CreateSourcingRequestResponse {
  type: SourcingResultType;
  analysis: SourcingAIAnalysis;
  match?: {
    product: SourcingProductReference;
    score: number;
  } | null;
  request?: SourcingRequest;
}

export interface CreateSourcingResponseInput {
  message?: string | null;
  expiresAt?: string | null;
  product: Record<string, unknown>;
}

export interface UpdateSourcingRequestStatusInput {
  status: SourcingRequestStatus;
}

export interface UpdateSourcingResponseStatusInput {
  status: SourcingResponseStatus;
}

export interface SourcingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}