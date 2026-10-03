export type FlexPayPlanStatus =
  | "ACTIVE"
  | "SHIPPING_DUE"
  | "COMPLETED"
  | "ORDER_FAILED"
  | "CANCELLED"
  | "EXPIRED";

export type FlexPayInstallmentStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";

export type FlexPaySourceType = "PRODUCT" | "CART";

export interface FlexPayInstallment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number | string;
  amountPaid: number | string;
  status: FlexPayInstallmentStatus | string;
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
}

export interface FlexPayPlan {
  id: string;
  planNumber: string;
  sourceType: FlexPaySourceType;
  status: FlexPayPlanStatus | string;
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
  createdAt: string;
  updatedAt: string;

  items: FlexPayPlanItem[];
  installments: FlexPayInstallment[];
}

export interface FlexPayPlansResponse {
  success: boolean;
  message: string;
  data: FlexPayPlan[];
}

export interface FlexPayPlanResponse {
  success: boolean;
  message: string;
  data: FlexPayPlan;
}

export interface InitializeFlexPayPaymentPayload {
  amount: number;
}

export interface FlexPayPayment {
  planId: string;
  planNumber: string;
  paymentId: string;
  reference: string;
  provider: "PAYSTACK";
  status: string;
  authorizationUrl?: string | null;
  accessCode?: string | null;
  amount: number | string;
  currency: string;
}

export interface InitializeFlexPayPaymentResponse {
  success: boolean;
  message: string;
  data: FlexPayPayment;
}
