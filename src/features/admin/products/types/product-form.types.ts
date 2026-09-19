import type { ProductMedia } from "../../../../types/product.types";

export type ProductFormStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductFormFulfillmentType =
  | "LOCAL"
  | "IMPORT"
  | "PREORDER"
  | "DIGITAL";

export type ProductFormShippingType =
  | "LOCAL"
  | "IMPORT"
  | "SEA"
  | "AIR"
  | "DIGITAL";

export interface ProductFormVariant {
  /** Present for existing variants only. */
  id?: string;

  sku: string;
  color: string;
  size: string;

  price: string;
  compareAtPrice: string;
  stock: string;

  weight: string;
  actualWeight: string;

  length: string;
  width: string;
  height: string;

  fulfillmentType: ProductFormFulfillmentType;
  shippingType: ProductFormShippingType;

  isActive: boolean;

  attributes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;

  existingMedia: ProductMedia[];
  /** Indices into `ProductFormValues.newImages`. */
  imageIndexes: number[];
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;

  brandId: string;
  categoryId: string;
  collectionId: string;

  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;

  status: ProductFormStatus;

  metadata: Record<string, unknown> | null;

  variants: ProductFormVariant[];

  /** Newly selected File objects (uploads). */
  newImages: File[];
}
