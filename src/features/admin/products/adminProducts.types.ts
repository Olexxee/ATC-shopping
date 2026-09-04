import type {
  CreateProductInput,
  CreateVariantInput,
} from "./admin.products.api";

export interface ProductVariantFormValues {
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

  fulfillmentType: NonNullable<CreateVariantInput["fulfillmentType"]>;
  shippingType: NonNullable<CreateVariantInput["shippingType"]>;

  isActive: boolean;

  // 👇 NEW: which global image indices belong to this variant
  imageIndexes: number[];
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;

  categoryId: string;
  brandId: string;
  collectionId: string;

  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;

  status: "DRAFT" | "ACTIVE";

  variants: ProductVariantFormValues[];

  images: File[];
}

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",

  categoryId: "",
  brandId: "",
  collectionId: "",

  isFeatured: false,
  isNew: false,
  isBestSeller: false,

  status: "DRAFT",

  variants: [
    {
      sku: "",
      color: "",
      size: "",
      price: "",
      compareAtPrice: "",
      stock: "",
      weight: "",
      actualWeight: "",
      length: "",
      width: "",
      height: "",
      fulfillmentType: "LOCAL",
      shippingType: "LOCAL",
      isActive: true,
      imageIndexes: [], // 👈 default empty
    },
  ],

  images: [],
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function optionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  return Number(value);
}

function requiredNumber(value: string): number {
  return Number(value);
}

// ----------------------------------------------------------------------------
// SKU generator
// ----------------------------------------------------------------------------

export function generateSkuFromName(name: string): string {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ----------------------------------------------------------------------------
// API transformation
// ----------------------------------------------------------------------------

export function toCreateProductInput(
  values: ProductFormValues,
): CreateProductInput {
  return {
    name: values.name.trim(),
    slug: values.slug.trim().toLowerCase(),
    description: values.description.trim() || undefined,
    categoryId: values.categoryId,
    brandId: values.brandId.trim() || undefined,
    collectionId: values.collectionId.trim() || undefined,
    isFeatured: values.isFeatured,
    isNew: values.isNew,
    isBestSeller: values.isBestSeller,
    status: values.status,

    variants: values.variants.map((variant) => ({
      sku: variant.sku.trim() || undefined,
      color: variant.color.trim() || undefined,
      size: variant.size.trim() || undefined,
      price: requiredNumber(variant.price),
      weight: requiredNumber(variant.weight),
      actualWeight: requiredNumber(variant.actualWeight),
      compareAtPrice: optionalNumber(variant.compareAtPrice),
      stock: optionalNumber(variant.stock),
      fulfillmentType: variant.fulfillmentType,
      shippingType: variant.shippingType,
      length: optionalNumber(variant.length),
      width: optionalNumber(variant.width),
      height: optionalNumber(variant.height),
      isActive: variant.isActive,
      // 👇 Send per‑variant image indexes
      imageIndexes: variant.imageIndexes,
    })),
  };
}
