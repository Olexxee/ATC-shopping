export type FlexPayStatus =
  | "ACTIVE"
  | "SHIPPING_DUE"
  | "COMPLETED"
  | "ORDER_FAILED"
  | "CANCELLED"
  | "EXPIRED";

export type InstallmentStatus =
  | "PENDING"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE";

export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "ABANDONED"
  | "REVERSED";

export interface FlexPayUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface FlexPayItem {
  id: string;
  productName: string;
  variantLabel: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;

  variant?: {
    id: string;
    sku: string;
    price: number;
    stock: number;

    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface FlexPayInstallment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number;
  amountPaid: number;
  status: InstallmentStatus;
  paidAt: string | null;
}

export interface FlexPayPaymentAllocation {
  id: string;
  amount: number;

  installment: {
    id: string;
    sequence: number;
    amount: number;
    amountPaid: number;
    status: InstallmentStatus;
    paidAt: string | null;
  };
}

export interface FlexPayPayment {
  id: string;
  reference: string;
  providerReference: string | null;
  paymentType: "INSTALLMENT_PAYMENT";
  provider: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  authorizationUrl: string | null;
  accessCode: string | null;
  providerPayload?: unknown;
  createdAt: string;

  allocations?: FlexPayPaymentAllocation[];
}

export interface FlexPayOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount?: number;
  createdAt: string;
}

export interface AdminFlexPayPlan {
  id: string;
  planNumber: string;
  userId: string;

  sourceType: "PRODUCT" | "CART";
  status: FlexPayStatus;
  currency: string;

  productSubtotal: number;
  shippingCost: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;

  installmentCount: number;
  installmentIntervalDays: number;

  nextDueAt: string | null;
  firstPaymentAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;

  customerName: string;
  customerEmail: string | null;
  customerPhone: string;

  shippingLabel: string | null;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string | null;
  shippingCountry: string;

  createdAt: string;
  updatedAt: string;

  user?: FlexPayUser;
  items: FlexPayItem[];
  installments: FlexPayInstallment[];
  payments?: FlexPayPayment[];
  order: FlexPayOrder | null;
}

export interface FlexPayStats {
  counts: {
    active: number;
    shippingDue: number;
    completed: number;
    orderFailed: number;
    cancelled: number;
    expired: number;
  };

  financials: {
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    productSubtotal: number;
    shippingCost: number;
  };
}

export interface AdminFlexPayListResponse {
  data: AdminFlexPayPlan[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
