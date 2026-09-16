export interface OrderMedia {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface GetMyOrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrdersMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
  meta: OrdersMeta;
}


export interface OrderBrand {
  id: string;
  name: string;
}

export interface OrderCategory {
  id: string;
  name: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  slug: string;
  brand?: OrderBrand | null;
  category?: OrderCategory | null;
}

export interface OrderVariant {
  id: string;
  sku: string;
  name?: string | null;
  price?: number | string;
  stock?: number;
  media: OrderMedia[];
  product: OrderProduct;
}

export interface OrderItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPriceSnapshot: number | string;
  totalPrice: number | string;
  cbm?: number | string;
  chargeableWeight?: number | string;
  variant: OrderVariant;
}

export interface OrderPayment {
  id: string;
  status: string;
  amount: number | string;
  provider: string;
  createdAt?: string;
}

export interface OrderFulfillmentItem {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number | string;
}

export interface OrderWarehouse {
  id: string;
  name?: string | null;
  code?: string | null;
  [key: string]: unknown;
}

export interface OrderFulfillment {
  id: string;
  type: string;
  status: string;
  warehouseId?: string | null;
  warehouse?: OrderWarehouse | null;
  items: OrderFulfillmentItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderCustomer {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;

  userId: string;

  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;

  shippingLabel?: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string | null;
  shippingCountry: string;

  subtotal: number | string;
  shippingCost: number | string;
  taxAmount: number | string;
  totalAmount: number | string;

  status: string;
  notes?: string | null;

  cbm?: number | string | null;
  chargeableWeight?: number | string | null;
  cbmData?: unknown;
  fulfillmentGroups?: unknown;

  createdAt: string;
  updatedAt: string;

  items: OrderItem[];
  payments: OrderPayment[];
  fulfillments: OrderFulfillment[];

  user: OrderCustomer;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}
