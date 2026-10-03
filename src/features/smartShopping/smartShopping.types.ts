export type SmartShoppingDestination = {
  country?: string | null;
  state?: string | null;
  city?: string | null;
};

export type SmartShoppingRequest = {
  message: string;
  destination?: SmartShoppingDestination | null;
};

export type SmartShoppingIntent = {
  intent: string;
  productType: string | null;
  category: string | null;
  brand: string | null;
  model: string | null;
  useCase: string | null;
  recipient: string | null;

  budget: {
    currency: string;
    min: number | null;
    max: number | null;
  };

  attributes: Record<string, unknown>;

  preferredColors: string[];
  preferredSizes: string[];

  quantity: number;

  urgency: "none" | "low" | "medium" | "high";

  deliveryRequirement: {
    preference: "none" | "fast" | "standard" | "economical";
    requiredBy: string | null;
  };

  searchTerms: string[];
  exclusions: string[];
};

export type SmartShoppingMedia = {
  id?: string;
  url: string;
  isPrimary?: boolean;
};

export type SmartShoppingVariant = {
  id: string;
  sku: string;

  color: string | null;
  size: string | null;

  price: number;
  compareAtPrice: number | null;
  stock: number;

  fulfillmentType: "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

  shippingType: "LOCAL" | "IMPORT" | "SEA" | "AIR" | "DIGITAL";

  media: SmartShoppingMedia[];
};

export type SmartShoppingShipping = {
  status: "AVAILABLE" | "UNAVAILABLE";

  shippingCost: number | null;
  grandTotal: number | null;

  pricingSource?: string | null;

  configuration?: {
    id: string;
    name: string;
    status: string;
  } | null;
};

export type SmartShoppingProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;

  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  price: {
    min: number;
    max: number;
  };

  variants: SmartShoppingVariant[];

  relevanceScore: number;

  shipping: SmartShoppingShipping;
};

export type SmartShoppingResult = {
  intent: SmartShoppingIntent;

  summary: string;

  products: SmartShoppingProduct[];

  meta: {
    total: number;
    shippingCalculated: boolean;
  };
};
