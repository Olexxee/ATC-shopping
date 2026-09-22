import { api } from "../../../../lib/api";
import type { Product, ProductStatus } from "../../../../types/product.types";
export type { ProductStatus } from "../../../../types/product.types";

// ============================================================================
// ENUM-LIKE UNIONS
// ============================================================================

export type ProductFulfillmentType =
  | "LOCAL"
  | "IMPORT"
  | "PREORDER"
  | "DIGITAL";

export type ProductShippingType = "LOCAL" | "IMPORT" | "SEA" | "AIR" | "DIGITAL";

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

/**
 * Scalar-only product fields for **creates**.
 *
 * Mirrors the backend's `createProductSchema`. Required fields are required
 * here on purpose; the backend will reject a create payload missing any of
 * them, so the client should refuse to send one.
 *
 * Note: `variants` is intentionally absent — variants are managed through
 * `/products/:id/variants`, not through the product's own create/update
 * payload. See `ProductPayload` for the create-time wrapper that carries them.
 */
export interface ProductScalarInput {
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
}

/**
 * Scalar-only product fields for **updates**.
 *
 * Every field is optional. Omitted fields are left untouched on the backend;
 * a field explicitly set to `null` clears the corresponding column. This is
 * derived from `ProductScalarInput` so the two can never drift.
 */
export type ProductScalarUpdateInput = Partial<ProductScalarInput>;

/**
 * Full create payload — matches `createProductSchema`, which requires at
 * least one variant.
 */
export interface ProductPayload extends ProductScalarInput {
  variants: ProductVariantInput[];
}

// ============================================================================
// FORM SHAPES
// ============================================================================

export interface CreateProductForm {
  product: ProductPayload;
  images: File[];
}

export interface UpdateProductForm {
  /** No `variants` — the update endpoint doesn't accept them. */
  product: ProductScalarUpdateInput;
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
// MULTIPART BUILDERS
// ============================================================================

/**
 * Appends scalar fields to a multipart body.
 *
 * Accepts a partial so it works for both create (required fields present)
 * and update (any subset). The `!== undefined` guard is load-bearing:
 *
 *   - `formData.append("name", undefined)` would send the literal string
 *     `"undefined"` to the backend, which Joi would then either accept as a
 *     real value or reject with a confusing message.
 *   - `isFeatured: false` is a meaningful value, so a truthiness check
 *     (`product.isFeatured ?? false`) would silently drop it.
 *   - `description: null` explicitly clears the field; `undefined` means
 *     "leave it alone". Those need different handling.
 */
const appendScalarFields = (
  formData: FormData,
  product: Partial<ProductScalarInput>,
): void => {
  // Required on create; may be omitted on update.
  if (product.name !== undefined) {
    formData.append("name", product.name);
  }
  if (product.slug !== undefined) {
    formData.append("slug", product.slug);
  }
  if (product.categoryId !== undefined) {
    formData.append("categoryId", product.categoryId);
  }

  // Optional strings / nullable strings.
  if (product.description !== undefined) {
    formData.append("description", product.description ?? "");
  }
  if (product.brandId !== undefined) {
    formData.append("brandId", product.brandId ?? "");
  }
  if (product.collectionId !== undefined) {
    formData.append("collectionId", product.collectionId ?? "");
  }

  // Booleans — `false` must survive.
  if (product.isFeatured !== undefined) {
    formData.append("isFeatured", String(product.isFeatured));
  }
  if (product.isNew !== undefined) {
    formData.append("isNew", String(product.isNew));
  }
  if (product.isBestSeller !== undefined) {
    formData.append("isBestSeller", String(product.isBestSeller));
  }

  if (product.status !== undefined) {
    formData.append("status", product.status);
  }

  // Only send metadata when it's an actual object. Sending
  // JSON.stringify(null) === "null" makes Joi see a string.
  if (product.metadata !== undefined && product.metadata !== null) {
    formData.append("metadata", JSON.stringify(product.metadata));
  }
};

const buildCreateProductFormData = (
  product: ProductPayload,
  images: File[],
): FormData => {
  const formData = new FormData();

  appendScalarFields(formData, product);
  formData.append("variants", JSON.stringify(product.variants));

  for (const image of images) {
    formData.append("variantImages", image);
  }

  return formData;
};

const buildUpdateProductFormData = (
  product: ProductScalarUpdateInput,
  images: File[],
): FormData => {
  const formData = new FormData();

  appendScalarFields(formData, product);
  // Deliberately no `variants` field — updateProductSchema doesn't accept one.

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
  const formData = buildCreateProductFormData(product, images);

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
  const formData = buildUpdateProductFormData(product, images);

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