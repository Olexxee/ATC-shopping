import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <ShoppingBag
        size={40}
        strokeWidth={1.4}
        className="text-[var(--text-muted)]"
      />

      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
        Your cart is empty
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
        Looks like you haven&apos;t added anything to your cart yet. Explore our
        products and find something you&apos;ll love.
      </p>

      <Link
        to="/products"
        className="
          mt-6
          inline-flex
          h-10
          items-center
          gap-2
          rounded-md
          bg-[var(--brand)]
          px-5
          text-sm
          font-semibold
          text-white
          no-underline
          transition-colors
          duration-200
          hover:bg-[var(--brand-hover)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--brand)]
          focus-visible:ring-offset-2
        "
      >
        <ArrowLeft size={16} strokeWidth={1.8} />
        Continue shopping
      </Link>
    </div>
  );
}