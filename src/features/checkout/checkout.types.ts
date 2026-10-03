export type CheckoutPaymentProvider = "PAYSTACK";

export type CheckoutPaymentMode = "FULL" | "FLEXPAY";

export interface CheckoutPayload {
  addressId: string;
  notes?: string;
  paymentProvider?: CheckoutPaymentProvider;
}

export interface CheckoutPayment {
  paymentId: string;
  reference: string;
  provider: CheckoutPaymentProvider;
  status: string;
  authorizationUrl?: string | null;
  accessCode?: string | null;
  providerReference?: string | null;
}

export interface CheckoutShippingQuote {
  shippingCost?: number | string;
  [key: string]: unknown;
}

export interface CheckoutOrder {
  id: string;
  orderNumber: string;
  subtotal: number | string;
  shippingCost: number | string;
  taxAmount: number | string;
  totalAmount: number | string;
  status: string;
}

export interface CheckoutResponseData extends CheckoutOrder {
  payment: CheckoutPayment;
  shippingQuote?: CheckoutShippingQuote;
  fulfillmentGroups?: Record<string, unknown[]>;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: CheckoutResponseData;
}

// ============================================================
// FLEXPAY
// ============================================================

export interface CreateFlexPayPlanPayload {
  sourceType: "CART";
  cartItemIds: string[];
  addressId: string;
  installmentCount: number;
  installmentIntervalDays: number;
}

export interface FlexPayInstallment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number | string;
  amountPaid: number | string;
  status: string;
  paidAt?: string | null;
}

export interface FlexPayPlanItem {
  id: string;
  variantId: string;
  sku: string;
  productName: string;
  variantLabel?: string | null;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
  createdAt?: string;
}

export interface FlexPayPlan {
  id: string;
  planNumber: string;
  sourceType: "PRODUCT" | "CART";
  status: string;
  currency: string;

  productSubtotal: number | string;
  shippingCost: number | string;
  totalAmount: number | string;

  amountPaid: number | string;
  balanceDue: number | string;

  installmentCount: number;
  installmentIntervalDays: number;

  nextDueAt?: string | null;
  firstPaymentAt?: string | null;
  completedAt?: string | null;

  customerName?: string;
  customerEmail?: string | null;
  customerPhone?: string;

  shippingLabel?: string | null;
  shippingStreet?: string;
  shippingCity?: string;
  shippingState?: string | null;
  shippingCountry?: string;

  createdAt: string;
  updatedAt: string;

  items: FlexPayPlanItem[];
  installments: FlexPayInstallment[];

  orderId?: string | null;
}

export interface CreateFlexPayPlanResponse {
  success: boolean;
  message?: string;
  data: FlexPayPlan;
}

export interface InitializeFlexPayPaymentPayload {
  amount: number;
}

export interface InitializeFlexPayPaymentData {
  planId: string;
  planNumber: string;
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  amount: number;
  currency: string;
  status: string;
}

export interface InitializeFlexPayPaymentResponse {
  success: boolean;
  message?: string;
  data: InitializeFlexPayPaymentData;
}
