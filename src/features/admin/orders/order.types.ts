// src/features/admin/orders/order.types.ts

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type FulfillmentType = "LOCAL" | "IMPORT" | "PREORDER" | "DIGITAL";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentProvider = "PAYSTACK" | "STRIPE" | "PAYPAL" | string;

export type FulfillmentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface ProductBrand {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface VariantMedia {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface OrderProduct {
  id: string;
  name: string;
  slug: string;
  brand?: ProductBrand | null;
  category?: ProductCategory | null;
}

export interface OrderVariant {
  id: string;
  sku: string;
  price: number;
  weight: number | null;
  fulfillmentType: FulfillmentType;
  shippingType: string | null;
  length: number | null;
  width: number | null;
  height: number | null;
  actualWeight: number | null;
  media: VariantMedia[];
  product: OrderProduct;
}

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPriceSnapshot: number;
  totalPrice: number;
  cbm: number | null;
  chargeableWeight: number | null;
  variant: OrderVariant;
}

export interface OrderPayment {
  id: string;
  status: PaymentStatus | string;
  amount: number;
  provider: PaymentProvider;
  reference?: string | null;
  createdAt?: string;
}

export interface OrderWarehouse {
  id: string;
  name: string;
  code: string;
  type: FulfillmentType;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  isActive: boolean;
}

export interface OrderFulfillmentItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderFulfillment {
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
  items: OrderFulfillmentItem[];
  warehouse: OrderWarehouse | null;
}

export interface OrderUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;

  userId: string;

  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;

  shippingLabel: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string | null;
  shippingCountry: string | null;

  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;

  status: OrderStatus;

  notes: string | null;

  cbm: number | null;
  chargeableWeight: number | null;
  cbmData: Record<string, unknown> | null;
  cbmUpdatedAt: string | null;
  cbmUpdatedBy: string | null;

  fulfillmentGroups: Record<string, unknown> | null;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
  payments: OrderPayment[];
  fulfillments: OrderFulfillment[];
  user: OrderUser | null;
}

export interface OrderPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  data: Order[];
  meta: OrderPagination;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface OrderTimelineEvent {
  status: string;
  timestamp: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface UpdateOrderCBMPayload {
  totalCBM: number;
  totalChargeableWeight: number;
  items?: Array<{
    variantId: string;
    cbm: number;
    chargeableWeight: number;
  }>;
  measurements?: Record<string, unknown>;
  notes?: string | null;
}
