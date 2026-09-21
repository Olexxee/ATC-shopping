export type CheckoutPaymentProvider =
  | "PAYSTACK"
  | "PAWAPAY";

export interface CheckoutPayload {
  addressId: string;
  notes?: string;
  paymentProvider?: CheckoutPaymentProvider;
  phoneNumber?: string;
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
