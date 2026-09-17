// src/features/admin/fulfillment/fulfillment.types.ts

export type FulfillmentType = "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

export type FulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface FulfillmentProduct {
  id: string;
  name: string;
  slug: string;
}

export interface FulfillmentVariant {
  id: string;
  sku: string;
  price: number;
  weight: number | null;
  actualWeight: number | null;
  fulfillmentType: FulfillmentType;
  shippingType: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  product: FulfillmentProduct;
}

export interface FulfillmentItem {
  id: string;
  quantity: number;
  unitPrice: number;
  variant: FulfillmentVariant;
}

export interface FulfillmentWarehouse {
  id: string;
  name: string;
  code: string;
  type: FulfillmentType;
  city: string | null;
  state: string | null;
  country: string | null;
  isActive: boolean;
}

export interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingLabel: string | null;
  shippingStreet: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingCountry: string | null;
}

export interface Fulfillment {
  id: string;
  orderId: string;
  type: FulfillmentType;
  status: FulfillmentStatus;
  warehouseId: string | null;
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
  createdAt: string;
  updatedAt: string;
  items: FulfillmentItem[];
  warehouse: FulfillmentWarehouse | null;
  order: FulfillmentOrder;
}

export interface FulfillmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FulfillmentListResponse {
  data: Fulfillment[];
  meta: FulfillmentPagination;
}

export interface FulfillmentFilters {
  page?: number;
  limit?: number;
  orderId?: string;
  type?: FulfillmentType;
  status?: FulfillmentStatus;
  warehouseId?: string;
}

export interface UpdateFulfillmentStatusPayload {
  status: FulfillmentStatus;
}

export interface UpdateFulfillmentTrackingPayload {
  trackingNumber: string;
  carrier: string;
  trackingUrl?: string | null;
  estimatedDelivery?: string | null;
}
