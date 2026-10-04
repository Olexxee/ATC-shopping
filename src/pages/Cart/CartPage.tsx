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

  useEffect(() => {
    if (serverCart) {
      setCart(serverCart);
    }
  }, [serverCart, setCart]);

  if (isCartLoading && !cart) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="animate-pulse">
            <div className="h-4 w-28 rounded bg-[var(--surface)]" />

            <div className="mt-5 h-9 w-40 rounded bg-[var(--surface)]" />

            <div className="mt-2 h-4 w-24 rounded bg-[var(--surface)]" />

            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
              <div>
                <div className="border-y border-[var(--border)]">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 border-b border-[var(--border)] py-6 last:border-b-0"
                    >
                      <div className="h-24 w-24 shrink-0 rounded-lg bg-[var(--surface)] sm:h-32 sm:w-32" />

                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-1/2 rounded bg-[var(--surface)]" />
                        <div className="h-3 w-1/3 rounded bg-[var(--surface)]" />
                        <div className="h-3 w-1/4 rounded bg-[var(--surface)]" />
                        <div className="h-9 w-28 rounded bg-[var(--surface)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="h-6 w-32 rounded bg-[var(--surface)]" />

                <div className="space-y-4">
                  <div className="h-4 rounded bg-[var(--surface)]" />
                  <div className="h-4 rounded bg-[var(--surface)]" />
                  <div className="h-4 rounded bg-[var(--surface)]" />
                </div>

                <div className="border-t border-[var(--border)] pt-5">
                  <div className="h-5 rounded bg-[var(--surface)]" />
                </div>

                <div className="h-11 rounded-md bg-[var(--surface)]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError && !cart) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <ShoppingBag
          size={40}
          strokeWidth={1.4}
          className="text-[var(--text-muted)]"
        />

        <h1 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
          Unable to load your cart
        </h1>

        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
          We couldn&apos;t retrieve your cart right now. Please try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
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
            transition-colors
            duration-200
            hover:bg-[var(--brand-hover)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--brand)]
            focus-visible:ring-offset-2
          "
        >
          <RefreshCw size={16} strokeWidth={1.8} />
          Try again
        </button>
      </main>
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
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header>
          <Link
            to="/products"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-[var(--text-secondary)]
              no-underline
              transition-colors
              duration-200
              hover:text-[var(--brand)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--brand)]
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Continue shopping
          </Link>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight
                  text-[var(--text-primary)]
                  sm:text-4xl
                "
              >
                Shopping cart
              </h1>

              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {cart.totalItems}{" "}
                {cart.totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearMutation.isPending}
              className="
                hidden
                text-sm
                font-medium
                text-[var(--text-muted)]
                transition-colors
                duration-200
                hover:text-[var(--error)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:block
              "
            >
              {clearMutation.isPending ? "Clearing..." : "Clear cart"}
            </button>
          </div>
        </header>

        {actionError && (
          <div
            role="alert"
            className="
              mt-6
              border-l-2
              border-[var(--error)]
              bg-red-50
              px-4
              py-3
              text-sm
              text-[var(--error)]
            "
          >
            {actionError}
          </div>
        )}

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <section aria-labelledby="cart-items-heading">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={18}
                  strokeWidth={1.8}
                  className="text-[var(--text-secondary)]"
                />

                <h2
                  id="cart-items-heading"
                  className="text-sm font-semibold text-[var(--text-primary)]"
                >
                  Cart items
                </h2>
              </div>

              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearMutation.isPending}
                className="
                  text-xs
                  font-medium
                  text-[var(--text-muted)]
                  transition-colors
                  duration-200
                  hover:text-[var(--error)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-offset-2
                  sm:hidden
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {clearMutation.isPending ? "Clearing..." : "Clear cart"}
              </button>
            </div>

            <div className="mt-2">
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

          <CartSummary
            cart={cart}
            onCheckout={handleCheckout}
            isCheckingOut={false}
          />
        </div>
      </div>
    </main>
  );
}
