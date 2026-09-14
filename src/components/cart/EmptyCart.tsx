import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <ShoppingBag className="h-9 w-9 text-gray-400" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Your cart is empty
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        Looks like you haven't added anything to your cart yet. Explore our
        products and find something you'll love.
      </p>

      <Link
        to="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue shopping
      </Link>
    </div>
  );
}
