import { api } from "../../../lib/api";
import type { Product } from "../../../types/product.types";

export interface CreateVariantInput {
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

  shippingType?: "LOCAL" | "IMPORT" | "SEA" | "AIR" | "DIGITAL";

  isActive?: boolean;

  attributes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CreateProductInput {
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

  metadata?: Record<string, unknown>;

  variants: CreateVariantInput[];
}

export interface CreateProductForm {
  product: CreateProductInput;
  images: File[];
}

export const createProduct = async ({
  product,
  images,
}: CreateProductForm): Promise<Product> => {
  const formData = new FormData();

  formData.append("name", product.name);
  formData.append("slug", product.slug);
  formData.append("categoryId", product.categoryId);

  if (product.description) {
    formData.append("description", product.description);
  }

  if (product.brandId) {
    formData.append("brandId", product.brandId);
  }

  if (product.collectionId) {
    formData.append("collectionId", product.collectionId);
  }

  formData.append("isFeatured", String(product.isFeatured ?? false));

  formData.append("isNew", String(product.isNew ?? false));

  formData.append("isBestSeller", String(product.isBestSeller ?? false));

  formData.append("status", product.status ?? "DRAFT");

  formData.append("variants", JSON.stringify(product.variants));

  if (product.metadata) {
    formData.append("metadata", JSON.stringify(product.metadata));
  }

  for (const image of images) {
    formData.append("variantImages", image);
  }

  const response = await api.post("/api/products", formData);

  return response.data.data;
};


export const deleteProduct = async (
  productId: string,
): Promise<Product> => {
  const response = await api.delete(
    `/api/products/${productId}`,
  );

  return response.data.data;
};

