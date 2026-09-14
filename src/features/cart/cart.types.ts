export interface CartMedia {
  id: string;
  url: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface CartBrand {
  id: string;
  name: string;
  slug: string;
}

export interface CartCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  brand: CartBrand | null;
  category: CartCategory | null;
}

export interface CartVariant {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;

  price: number;
  weight: number;
  stock: number;
  isActive: boolean;

  fulfillmentType: "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

  shippingType: "LOCAL" | "IMPORT" | "SEA" | "AIR";

  length: number | null;
  width: number | null;
  height: number | null;

  cbm: number | null;
  actualWeight: number | null;

  images: CartMedia[];

  product: CartProduct | null;
}

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;

  unitPrice: number;
  lineTotal: number;

  availableStock: number;
  inStock: boolean;
  unavailable: boolean;

  variant: CartVariant | null;
}

export interface CBMItem {
  variantId: string;
  sku: string;
  productName: string;
  cbm: number;
  quantity: number;
}

export interface Cart {
  id: string;
  status: string;
  userId: string;

  items: CartItem[];

  subtotal: number;

  totalWeight: number;
  totalCBM: number;

  cbmItems: CBMItem[];

  totalItems: number;

  createdAt: string;
  updatedAt: string;
}

export interface CartSummary extends Cart {
  shippingEstimate: number | null;
  taxEstimate: number;
  grandTotal: number;
}

export interface AddCartItemPayload {
  variantId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CartValidationError {
  variantId: string;
  sku?: string;
  available?: number;
  requested?: number;
  error: string;
}

export interface CartValidationItem {
  variantId: string;
  quantity: number;
  price: number;
  total: number;
  variant: CartVariant;
}

export interface CartValidation {
  valid: boolean;
  errors: CartValidationError[];
  items: CartValidationItem[];
  totalItems: number;
}
