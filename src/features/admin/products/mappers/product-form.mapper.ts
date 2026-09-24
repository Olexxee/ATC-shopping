import type { Product } from "../../../../types/product.types";
import type {
  ProductFormValues,
  ProductFormVariant,
} from "../types/product-form.types";
import type {
  CreateAdminProductInput,
  AdminVariantInput,
} from "../api/adminProducts.api";

type ProductVariantInput = AdminVariantInput;
type ProductPayload = CreateAdminProductInput;

const decimalToString = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

export const createEmptyProductVariant = (): ProductFormVariant => ({
  sku: "",
  color: "",
  size: "",

  price: "",
  compareAtPrice: "",
  stock: "0",

  weight: "",
  actualWeight: "",

  length: "",
  width: "",
  height: "",

  fulfillmentType: "LOCAL",
  shippingType: "LOCAL",

  isActive: true,

  attributes: null,
  metadata: null,

  existingMedia: [],
  imageIndexes: [],
});

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",

  brandId: "",
  categoryId: "",
  collectionId: "",

  isFeatured: false,
  isNew: false,
  isBestSeller: false,

  status: "DRAFT",

  metadata: null,

  variants: [createEmptyProductVariant()],

  newImages: [],
};

export const productToFormValues = (product: Product): ProductFormValues => ({
  name: product.name,
  slug: product.slug,
  description: product.description ?? "",

  brandId: product.brandId ?? "",
  categoryId: product.categoryId,
  collectionId: product.collectionId ?? "",

  isFeatured: product.isFeatured,
  isNew: product.isNew,
  isBestSeller: product.isBestSeller,

  status: product.status,

  metadata: product.metadata ?? null,

  variants: product.variants.map((variant) => ({
    id: variant.id,

    sku: variant.sku ?? "",
    color: variant.color ?? "",
    size: variant.size ?? "",

    price: decimalToString(variant.price),
    compareAtPrice: decimalToString(variant.compareAtPrice),
    stock: String(variant.stock ?? 0),

    weight: decimalToString(variant.weight),
    actualWeight: decimalToString(variant.actualWeight),

    length: decimalToString(variant.length),
    width: decimalToString(variant.width),
    height: decimalToString(variant.height),

    fulfillmentType: variant.fulfillmentType,
    shippingType: variant.shippingType,

    isActive: variant.isActive,

    attributes: variant.attributes ?? null,
    metadata: variant.metadata ?? null,

    existingMedia: variant.media ?? [],
    imageIndexes: [],
  })),

  newImages: [],
});

// ============================================================================
// FORM → API
// ============================================================================

const toNumber = (value: string, fieldName: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return parsed;
};

const toOptionalNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid numeric value");
  }
  return parsed;
};

const formVariantToApiVariant = (
  variant: ProductFormVariant,
): ProductVariantInput => ({
  ...(variant.id ? { id: variant.id } : {}),

  sku: variant.sku.trim() || undefined,
  color: variant.color.trim() || undefined,
  size: variant.size.trim() || undefined,

  weight: toNumber(variant.weight, "Weight"),
  price: toNumber(variant.price, "Price"),
  compareAtPrice: toOptionalNumber(variant.compareAtPrice),
  stock: Number.parseInt(variant.stock || "0", 10),

  fulfillmentType: variant.fulfillmentType,

  length: toOptionalNumber(variant.length),
  width: toOptionalNumber(variant.width),
  height: toOptionalNumber(variant.height),

  actualWeight: toNumber(variant.actualWeight, "Actual weight"),

  shippingType: variant.shippingType,

  isActive: variant.isActive,

  attributes: variant.attributes ?? undefined,
  metadata: variant.metadata ?? undefined,

  imageIndexes: variant.imageIndexes,
});

export const formValuesToProductPayload = (
  values: ProductFormValues,
): ProductPayload => ({
  name: values.name.trim(),
  slug: values.slug.trim(),

  description: values.description.trim() || null,

  brandId: values.brandId || null,
  categoryId: values.categoryId,
  collectionId: values.collectionId || null,

  isFeatured: values.isFeatured,
  isNew: values.isNew,
  isBestSeller: values.isBestSeller,

  status: values.status,

  metadata: values.metadata,

  variants: values.variants.map(formVariantToApiVariant),
});
