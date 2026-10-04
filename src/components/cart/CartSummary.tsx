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
    <aside className="lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold text-[var(--text-primary)]">
        Order summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-6 text-sm">
          <span className="text-[var(--text-secondary)]">
            Subtotal ({cart.totalItems}{" "}
            {cart.totalItems === 1 ? "item" : "items"})
          </span>

          <span className="font-medium text-[var(--text-primary)]">
            ₦{cart.subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 text-sm">
          <span className="text-[var(--text-secondary)]">Shipping</span>

          <span className="text-right text-[var(--text-muted)]">
            Calculated at checkout
          </span>
        </div>

        <div className="flex items-center justify-between gap-6 text-sm">
          <span className="text-[var(--text-secondary)]">Tax</span>

          <span className="text-right text-[var(--text-muted)]">
            Calculated at checkout
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-[var(--border)]" />

      <div className="flex items-center justify-between gap-6">
        <span className="text-base font-semibold text-[var(--text-primary)]">
          Estimated total
        </span>

        <span className="text-xl font-semibold text-[var(--text-primary)]">
          ₦{cart.subtotal.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={isCheckingOut || cart.items.length === 0}
        className="
          mt-6
          flex
          h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-md
          bg-[var(--brand)]
          px-5
          text-sm
          font-semibold
          text-white
          transition-colors
          duration-200
          hover:bg-[var(--brand-hover)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--brand)]
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {isCheckingOut ? "Checking cart..." : "Proceed to checkout"}

        {!isCheckingOut && <ArrowRight size={16} strokeWidth={1.8} />}
      </button>

      <div className="mt-5 flex gap-3 border-t border-[var(--border)] pt-5">
        <ShieldCheck
          size={18}
          strokeWidth={1.8}
          className="mt-0.5 shrink-0 text-[var(--brand)]"
        />

        <p className="text-xs leading-5 text-[var(--text-muted)]">
          Your order total will be confirmed before payment. Stock and pricing
          are revalidated during checkout.
        </p>
      </div>
    </aside>
  );
}
