import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Cart } from "../../features/cart/cart.types";

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
  isCheckingOut?: boolean;
}

export default function CartSummary({
  cart,
  onCheckout,
  isCheckingOut = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Subtotal ({cart.totalItems}{" "}
            {cart.totalItems === 1 ? "item" : "items"})
          </span>

          <span className="font-medium text-gray-900">
            ₦{cart.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Shipping</span>

          <span className="text-gray-500">Calculated at checkout</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Tax</span>

          <span className="text-gray-500">Calculated at checkout</span>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">
          Estimated total
        </span>

        <span className="text-xl font-bold text-gray-900">
          ₦{cart.subtotal.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckingOut || cart.items.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCheckingOut ? "Checking cart..." : "Proceed to checkout"}

        {!isCheckingOut && <ArrowRight className="h-4 w-4" />}
      </button>

      <div className="mt-5 flex gap-3 rounded-lg bg-gray-50 p-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />

        <p className="text-xs leading-5 text-gray-500">
          Your order total will be confirmed before payment. Stock and pricing
          are revalidated during checkout.
        </p>
      </div>
    </div>
  );
}
