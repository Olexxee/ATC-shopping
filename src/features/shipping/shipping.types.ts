// Storefront-facing shipping types. These mirror the projection returned
// by GET /api/shipping/storefront — a subset of the admin shape.

export type ShippingType =
  | "DEFAULT"
  | "LOCAL"
  | "IMPORT"
  | "SEA"
  | "AIR"
  | "DIGITAL";

export interface StorefrontShippingRule {
  id: string;
  name: string;
  type: ShippingType;
  isActive: boolean;

  minSubtotal: number | string | null;
  maxSubtotal: number | string | null;
  minWeight: number | string | null;
  maxWeight: number | string | null;

  baseRate: number | string;
  ratePerKg: number | string;
  ratePerCBM: number | string;

  priority: number;
}

export interface StorefrontShipping {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";

  pricePerKg: number | string;
  pricePerCBM: number | string;
  handlingFee: number | string;
  minCharge: number | string;
  freeShippingThreshold: number | string | null;

  rules: StorefrontShippingRule[];
}
