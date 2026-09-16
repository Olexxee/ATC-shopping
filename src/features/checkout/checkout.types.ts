export interface CheckoutPayload {
  addressId: string;
  notes?: string;
}

export interface CheckoutPayment {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
  accessCode?: string | null;
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