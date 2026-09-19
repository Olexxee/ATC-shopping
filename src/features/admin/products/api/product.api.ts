import { api } from "../../../../lib/api";
import type { Product, ProductStatus } from "../../../../types/product.types";
export type { ProductStatus } from "../../../../types/product.types";

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

// ============================================================================
// WRITE PAYLOADS
// ============================================================================

export interface ProductVariantInput {
  /** Present for updates, omitted for creates. */
  id?: string;

  sku?: string;
  color?: string;
  size?: string;

  weight: number;
  price: number;
  compareAtPrice?: number | null;
  stock?: number;

  fulfillmentType?: ProductFulfillmentType;

  length?: number | null;
  width?: number | null;
  height?: number | null;

  actualWeight: number;

  shippingType?: ProductShippingType;

  isActive?: boolean;

  attributes?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;

  /** Indices into the multipart `variantImages` array. */
  imageIndexes?: number[];
}

export interface ProductImageInput {
  url: string;
  publicId: string;
  mimeType?: string | null;
  bytes?: number | null;
  format?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description?: string | null;

  brandId?: string | null;
  categoryId: string;
  collectionId?: string | null;

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  status?: ProductStatus;

  metadata?: Record<string, unknown> | null;

  variants: ProductVariantInput[];
}

export interface CreateProductForm {
  product: ProductPayload;
  images: File[];
}

export interface UpdateProductForm {
  product: ProductPayload;
  images: File[];
}

// ============================================================================
// LIST
// ============================================================================

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;

  status?: ProductStatus;

  categoryId?: string;
  brandId?: string;
  collectionId?: string;

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  minPrice?: number;
  maxPrice?: number;

  // NOTE: "price" is accepted by product.validation.js but productDb.findProducts
  // uses it directly as orderBy key and Product has no `price` column,
  // so it silently errors. Intentionally not exposed here.
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination?: PaginationMeta;
}

// ============================================================================
// ENVELOPE
// ============================================================================

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
  context?: string;
}

// ============================================================================
// MULTIPART BUILDER
// ============================================================================

const buildProductFormData = (
  product: ProductPayload,
  images: File[],
): FormData => {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("slug", product.slug);
  formData.append("categoryId", product.categoryId);

  formData.append("description", product.description ?? "");
  formData.append("brandId", product.brandId ?? "");
  formData.append("collectionId", product.collectionId ?? "");

  formData.append("isFeatured", String(product.isFeatured ?? false));
  formData.append("isNew", String(product.isNew ?? false));
  formData.append("isBestSeller", String(product.isBestSeller ?? false));

  formData.append("status", product.status ?? "DRAFT");

  formData.append("variants", JSON.stringify(product.variants));

  // Only send metadata when it's an actual object. Sending
  // JSON.stringify(null) === "null" makes Joi see a string.
  if (product.metadata !== undefined && product.metadata !== null) {
    formData.append("metadata", JSON.stringify(product.metadata));
  }

  for (const image of images) {
    formData.append("variantImages", image);
  }

  return formData;
};

// ============================================================================
// READ
// ============================================================================

export const getProducts = async (
  params?: ProductListParams,
): Promise<ProductListResponse> => {
  const response = await api.get<ApiEnvelope<{ products: Product[] }>>(
    "/api/products",
    { params },
  );

  return {
    products: response.data.data?.products ?? [],
    pagination: response.data.meta?.pagination,
  };
};

export const getProductById = async (productId: string): Promise<Product> => {
  const response = await api.get<ApiEnvelope<Product>>(
    `/api/products/${productId}`,
  );

  return response.data.data;
};

// ============================================================================
// CREATE
// ============================================================================

export const createProduct = async ({
  product,
  images,
}: CreateProductForm): Promise<Product> => {
  const formData = buildProductFormData(product, images);

  const response = await api.post<ApiEnvelope<Product>>(
    "/api/products",
    formData,
  );

  return response.data.data;
};

// ============================================================================
// UPDATE
// ============================================================================

export const updateProduct = async (
  productId: string,
  { product, images }: UpdateProductForm,
): Promise<Product> => {
  const formData = buildProductFormData(product, images);

  const response = await api.patch<ApiEnvelope<Product>>(
    `/api/products/${productId}`,
    formData,
  );

  return response.data.data;
};

// ============================================================================
// STATUS
// ============================================================================

export const updateProductStatus = async (
  productId: string,
  status: ProductStatus,
): Promise<Product> => {
  const response = await api.patch<ApiEnvelope<Product>>(
    `/api/products/${productId}/status`,
    { status },
  );

  return response.data.data;
};

// ============================================================================
// DELETE
// ============================================================================

export const deleteProduct = async (productId: string): Promise<Product> => {
  const response = await api.delete<ApiEnvelope<Product>>(
    `/api/products/${productId}`,
  );

  return response.data.data;
};
