export type ShippingStatus = "ACTIVE" | "INACTIVE";

export type ShippingType =
  | "DEFAULT"
  | "LOCAL"
  | "IMPORT"
  | "SEA"
  | "AIR"
  | "DIGITAL";

export interface ShippingConfiguration {
  id: string;
  name: string;
  status: ShippingStatus;
  pricePerKg: number | string;
  pricePerCBM: number | string;
  handlingFee: number | string;
  minCharge: number | string;
  freeShippingThreshold: number | string | null;
  rules?: ShippingRule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingRule {
  id: string;
  configurationId: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateShippingConfigurationPayload {
  name: string;
  status?: ShippingStatus;
  pricePerKg?: number;
  pricePerCBM?: number;
  handlingFee?: number;
  minCharge?: number;
  freeShippingThreshold?: number | null;
}

export interface UpdateShippingConfigurationPayload extends Partial<CreateShippingConfigurationPayload> {}

export interface CreateShippingRulePayload {
  configurationId: string;
  name: string;
  type?: ShippingType;
  isActive?: boolean;
  minSubtotal?: number | null;
  maxSubtotal?: number | null;
  minWeight?: number | null;
  maxWeight?: number | null;
  baseRate?: number;
  ratePerKg?: number;
  ratePerCBM?: number;
  priority?: number;
}

export interface UpdateShippingRulePayload extends Omit<
  CreateShippingRulePayload,
  "configurationId"
> {}
