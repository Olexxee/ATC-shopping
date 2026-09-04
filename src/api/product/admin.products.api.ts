// admin/admin.products.api.ts
import { api } from "../../lib/api";
import type { Product } from "../../types/product.types";

export interface CreateVariantPayload {
  sku?: string;
  color?: string;
  size?: string;
  weight: number;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  fulfillmentType?: "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";
  length?: number;
  width?: number;
  height?: number;
  actualWeight: number;
  shippingType?: "LOCAL" | "IMPORT" | "SEA" | "AIR";
  isActive?: boolean;
  images?: any;
  attributes?: any;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  description?: string;
  brandId?: string;
  categoryId: string;
  collectionId?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  metadata?: any;
  variants: CreateVariantPayload[];
}

export interface UpdateProductPayload extends Partial<
  Omit<CreateProductPayload, "variants">
> {
  variants?: CreateVariantPayload[];
}

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const response = await api.post("/api/admin/products", payload);
  return response.data.data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const response = await api.patch(`/api/admin/products/${id}`, payload);
  return response.data.data;
};

export const updateProductStatus = async (
  id: string,
  status: "DRAFT" | "ACTIVE" | "ARCHIVED",
): Promise<Product> => {
  const response = await api.patch(`/api/admin/products/${id}/status`, {
    status,
  });
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/api/admin/products/${id}`);
};
