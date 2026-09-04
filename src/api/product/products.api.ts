import { api } from "../../lib/api";
import type {
  Product,
  ProductVariant,
} from "../../types/product.types";

export interface GetProductsParams {
  page?: number;
  limit?: number;

  categoryId?: string;
  brandId?: string;
  collectionId?: string;

  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  minPrice?: number;
  maxPrice?: number;

  search?: string;

  sortBy?: "name" | "createdAt" | "updatedAt" | "price";
  sortOrder?: "asc" | "desc";
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };

  context: "catalog" | "homepage" | "product-detail";
}

export interface ProductListParams {
  limit?: number;
  categoryId?: string;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<ProductsResponse> {
  const response = await api.get("/api/products", {
    params,
  });

  return response.data;
}

export async function getFeaturedProducts(
  params?: ProductListParams,
): Promise<Product[]> {
  const response = await api.get("/api/products/featured", {
    params,
  });

  return response.data.data;
}

export async function getNewArrivals(
  params?: ProductListParams,
): Promise<Product[]> {
  const response = await api.get("/api/products/new-arrivals", {
    params,
  });

  return response.data.data;
}

export async function getBestSellers(
  params?: ProductListParams,
): Promise<Product[]> {
  const response = await api.get("/api/products/best-sellers", {
    params,
  });

  return response.data.data;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product> {
  const response = await api.get(
    `/api/products/slug/${slug}`,
  );

  return response.data.data;
}

export async function getProductById(
  id: string,
): Promise<Product> {
  const response = await api.get(
    `/api/products/${id}`,
  );

  return response.data.data;
}

export async function getRelatedProducts(
  productId: string,
  params?: { limit?: number },
): Promise<Product[]> {
  const response = await api.get(
    `/api/products/${productId}/related`,
    { params },
  );

  return response.data.data;
}

export async function getProductVariants(
  productId: string,
): Promise<ProductVariant[]> {
  const response = await api.get(
    `/api/products/${productId}/variants`,
  );

  return response.data.data;
}

