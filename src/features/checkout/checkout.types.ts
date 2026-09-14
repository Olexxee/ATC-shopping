export interface CheckoutPayload {
  addressId: string;
  notes?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    orderNumber: string;
    subtotal: number | string;
    shippingCost: number | string;
    taxAmount: number | string;
    totalAmount: number | string;
    status: string;
    shippingQuote?: {
      shippingCost?: number | string;
      [key: string]: unknown;
    };
  };
}
