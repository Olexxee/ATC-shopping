import { Loader2, ShoppingBag } from "lucide-react";

import type { Address } from "../../features/address/address.types";
import type { Cart } from "../../features/cart/cart.types";

type PaymentMode = "FULL" | "FLEXPAY";

interface CheckoutOrderSummaryProps {
  cart: Cart;
  selectedAddress?: Address;
  paymentMode: PaymentMode;
  isSubmitting: boolean;
  onSubmit: () => void;

  flexPaySubtotal: number;
  flexPayItemCount: number;
  canContinueFlexPay: boolean;
}

const formatCurrency = (value: number | string) => {
  const amount = Number(value);

  return `₦${(Number.isFinite(amount) ? amount : 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function CheckoutOrderSummary({
  cart,
  selectedAddress,
  paymentMode,
  isSubmitting,
  onSubmit,
  flexPaySubtotal,
  flexPayItemCount,
  canContinueFlexPay,
}: CheckoutOrderSummaryProps) {
  const isFlexPay = paymentMode === "FLEXPAY";

  const displaySubtotal = isFlexPay
    ? flexPaySubtotal
    : Number(cart.subtotal ?? 0);

  const displayItemCount = isFlexPay ? flexPayItemCount : cart.totalItems;

  const isSubmitDisabled =
    isSubmitting || !selectedAddress || (isFlexPay && !canContinueFlexPay);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* HEADER */}

      <div className="flex items-center gap-2">
        <ShoppingBag className="h-5 w-5 text-gray-700" />

        <h2 className="font-semibold text-gray-900">Order summary</h2>
      </div>

      {/* ITEMS */}

      <div className="mt-6 space-y-4">
        {cart.items.map((item) => {
          const productName = item.variant?.product?.name ?? "Product";

          const image =
            item.variant?.images?.find((media) => media.isPrimary)?.url ??
            item.variant?.images?.[0]?.url ??
            null;

          return (
            <div key={item.id} className="flex gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {image ? (
                  <img
                    src={image}
                    alt={productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">
                  {productName}
                </p>

                {item.variant?.color && (
                  <p className="mt-1 text-xs text-gray-500">
                    Color: {item.variant.color}
                  </p>
                )}

                {item.variant?.size && (
                  <p className="text-xs text-gray-500">
                    Size: {item.variant.size}
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>

              <p className="shrink-0 text-sm font-semibold text-gray-900">
                {formatCurrency(item.lineTotal)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="my-6 border-t border-gray-200" />

      {/* TOTALS */}

      <div className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">
            Subtotal ({displayItemCount}{" "}
            {displayItemCount === 1 ? "item" : "items"})
          </span>

          <span className="font-medium text-gray-900">
            {formatCurrency(displaySubtotal)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Shipping</span>

          <span className="text-right text-gray-500">
            {isFlexPay ? "Calculated after payment" : "Calculated at checkout"}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Tax</span>

          <span className="text-gray-500">{formatCurrency(0)}</span>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      {/* TOTAL */}

      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-semibold text-gray-900">
          {isFlexPay ? "Product total" : "Estimated total"}
        </span>

        <span className="text-xl font-bold text-gray-900">
          {formatCurrency(displaySubtotal)}
        </span>
      </div>

      {/* FLEXPAY NOTICE */}

      {isFlexPay && (
        <div className="mt-5 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold text-gray-700">Keplex FlexPay</p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Your first payment is made now. Shipping is calculated separately
            after your product balance is fully paid.
          </p>
        </div>
      )}

      {/* ADDRESS */}

      {selectedAddress && (
        <div className="mt-5 rounded-xl bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Delivering to
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {selectedAddress.fullName}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {selectedAddress.city}
            {selectedAddress.state ? `, ${selectedAddress.state}` : ""}
          </p>
        </div>
      )}

      {/* FLEXPAY VALIDATION */}

      {isFlexPay && !canContinueFlexPay && (
        <p className="mt-4 text-center text-xs leading-5 text-red-600">
          Select at least one valid product for FlexPay to continue.
        </p>
      )}

      {/* CTA */}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />

            {isFlexPay ? "Preparing payment..." : "Creating order..."}
          </>
        ) : isFlexPay ? (
          "Continue with FlexPay"
        ) : (
          "Place order"
        )}
      </button>
    </section>
  );
}
