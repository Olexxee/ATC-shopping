import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CartItemCard from "../../components/cart/CartItemCard";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";
import {
  useClearCart,
  useRemoveCartItem,
} from "../../features/cart/cart.mutations";
import { useCart } from "../../features/cart/cart.queries";
import { useCartStore } from "../../features/cart/cart.store";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError,
    refetch,
  } = useCart(true);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const pendingUpdates = useCartStore((state) => state.pendingUpdates);

  const removeMutation = useRemoveCartItem();
  const clearMutation = useClearCart();

  const [actionError, setActionError] = useState("");

  /*
   * Hydrate Zustand from the server cart.
   */
  useEffect(() => {
    if (serverCart) {
      setCart(serverCart);
    }
  }, [serverCart, setCart]);

  /*
   * While React Query is loading for the first time,
   * there is no local cart yet.
   */
  if (isCartLoading && !cart) {
    return (
      <div className="min-h-[60vh] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 w-32 rounded bg-gray-200" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex gap-4">
                      <div className="h-28 w-28 rounded-lg bg-gray-200" />

                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                        <div className="h-3 w-1/3 rounded bg-gray-200" />
                        <div className="h-9 w-28 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-72 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError && !cart) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <ShoppingBag className="h-7 w-7 text-red-500" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-gray-900">
          Unable to load your cart
        </h1>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          We couldn't retrieve your cart right now. Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  if (!cart) {
    return null;
  }

  if (cart.items.length === 0) {
    return <EmptyCart />;
  }

  const handleUpdateQuantity = (variantId: string, quantity: number) => {
    setActionError("");

    updateQuantity(variantId, quantity, (message) => {
      setActionError(message);
    });
  };

  const handleRemove = (variantId: string) => {
    setActionError("");

    removeMutation.mutate(variantId, {
      onSuccess: (updatedCart) => {
        setCart(updatedCart);
      },
      onError: (error) => {
        setActionError(
          error instanceof Error
            ? error.message
            : "Unable to remove this item.",
        );
      },
    });
  };

  const handleClearCart = () => {
    setActionError("");

    clearMutation.mutate(undefined, {
      onSuccess: (updatedCart) => {
        setCart(updatedCart);
      },
      onError: (error) => {
        setActionError(
          error instanceof Error ? error.message : "Unable to clear your cart.",
        );
      },
    });
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-500 no-underline transition hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue shopping
            </Link>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Shopping Cart
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearMutation.isPending}
            className="self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            {clearMutation.isPending ? "Clearing..." : "Clear cart"}
          </button>
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-gray-700" />

              <h2 className="font-semibold text-gray-900">Cart items</h2>
            </div>

            <div className="mt-4">
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isUpdating={pendingUpdates[item.variantId] === true}
                  isRemoving={
                    removeMutation.isPending &&
                    removeMutation.variables === item.variantId
                  }
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <CartSummary cart={cart} onCheckout={handleCheckout} />
          </aside>
        </div>
      </div>
    </main>
  );
}
