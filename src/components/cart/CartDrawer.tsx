import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Drawer from "../ui/Drawer";
import { useCurrentUser } from "../../features/auth/auth.queries";
import {
  useRemoveCartItem,
} from "../../features/cart/cart.mutations";
import { useCart } from "../../features/cart/cart.queries";
import { useCartStore } from "../../features/cart/cart.store";


interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } =
    useCurrentUser();

  const isAuthenticated =
    !authLoading && Boolean(user);

  const { data: serverCart } = useCart(isAuthenticated);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity,
  );
  const pendingUpdates = useCartStore(
    (state) => state.pendingUpdates,
  );

  const removeMutation = useRemoveCartItem();

  const [actionError, setActionError] = useState("");

  /*
   * Prefer the Zustand cart because quantity updates happen
   * there immediately. React Query remains the server source
   * and hydrates the store when available.
   */
  const activeCart = cart ?? serverCart;

  const handleUpdateQuantity = (
    variantId: string,
    quantity: number,
  ) => {
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

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={
        activeCart?.totalItems
          ? `Cart (${activeCart.totalItems})`
          : "Cart"
      }
      widthClassName="w-full sm:max-w-[420px]"
    >
      {!activeCart ? (
        <div className="flex h-full items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag
              size={32}
              strokeWidth={1.4}
              className="mx-auto text-[var(--text-muted)]"
            />

            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Loading your cart...
            </p>
          </div>
        </div>
      ) : activeCart.items.length === 0 ? (
        <div className="flex h-full items-center justify-center px-6">
          <div className="text-center">
            <ShoppingBag
              size={38}
              strokeWidth={1.4}
              className="mx-auto text-[var(--text-muted)]"
            />

            <h3 className="mt-5 text-base font-semibold text-[var(--text-primary)]">
              Your cart is empty
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Add something from the catalog and it will appear
              here.
            </p>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/products");
              }}
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
              Browse products
              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="px-5">
              {actionError && (
                <div
                  role="alert"
                  className="
                    border-l-2
                    border-[var(--error)]
                    bg-red-50
                    px-3
                    py-2.5
                    text-xs
                    leading-5
                    text-[var(--error)]
                  "
                >
                  {actionError}
                </div>
              )}

              <div className={actionError ? "mt-3" : ""}>
                {activeCart.items.map((item) => {
                  const variant = item.variant;
                  const product = variant?.product;

                  const image =
                    variant?.images?.find(
                      (media) => media.isPrimary,
                    )?.url ||
                    variant?.images?.[0]?.url ||
                    null;

                  const isUpdating =
                    pendingUpdates[item.variantId] === true;

                  const isRemoving =
                    removeMutation.isPending &&
                    removeMutation.variables === item.variantId;

                  const canIncrease =
                    !isRemoving &&
                    item.quantity < item.availableStock &&
                    !item.unavailable;

                  const canDecrease =
                    !isRemoving && item.quantity > 1;

                  return (
                    <div
                      key={item.id}
                      className="
                        border-b
                        border-[var(--border)]
                        py-5
                        last:border-b-0
                      "
                    >
                      <div className="flex gap-3">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)]">
                          {image ? (
                            <img
                              src={image}
                              alt={
                                product?.name ||
                                "Cart item"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center px-2 text-center text-[10px] text-[var(--text-muted)]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                                {product?.name ||
                                  "Product unavailable"}
                              </p>

                              {product?.brand && (
                                <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">
                                  {product.brand.name}
                                </p>
                              )}

                              {variant && (
                                <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                                  {[variant.color, variant.size]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(item.variantId)
                              }
                              disabled={
                                isRemoving || isUpdating
                              }
                              aria-label={`Remove ${
                                product?.name || "item"
                              } from cart`}
                              className="
                                shrink-0
                                p-1
                                text-[var(--text-muted)]
                                transition-colors
                                duration-200
                                hover:text-[var(--brand)]
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[var(--brand)]
                                focus-visible:ring-offset-2
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              <Trash2
                                size={15}
                                strokeWidth={1.8}
                              />
                            </button>
                          </div>

                          {item.unavailable && (
                            <p className="mt-2 text-xs text-[var(--error)]">
                              This item is no longer available.
                            </p>
                          )}

                          {!item.unavailable &&
                            !item.inStock && (
                              <p className="mt-2 text-xs text-[var(--warning)]">
                                Only {item.availableStock}{" "}
                                {item.availableStock === 1
                                  ? "item"
                                  : "items"}{" "}
                                available.
                              </p>
                            )}

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div
                              className="
                                flex
                                items-center
                                border
                                border-[var(--border)]
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.variantId,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={!canDecrease}
                                aria-label="Decrease quantity"
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  text-[var(--text-secondary)]
                                  transition-colors
                                  duration-200
                                  hover:bg-[var(--brand-soft)]
                                  hover:text-[var(--brand)]
                                  focus-visible:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-[var(--brand)]
                                  focus-visible:ring-inset
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                              >
                                <Minus
                                  size={14}
                                  strokeWidth={1.8}
                                />
                              </button>

                              <span
                                className="
                                  flex
                                  h-8
                                  min-w-8
                                  items-center
                                  justify-center
                                  border-x
                                  border-[var(--border)]
                                  px-1
                                  text-xs
                                  font-medium
                                  text-[var(--text-primary)]
                                "
                              >
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.variantId,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={!canIncrease}
                                aria-label="Increase quantity"
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  text-[var(--text-secondary)]
                                  transition-colors
                                  duration-200
                                  hover:bg-[var(--brand-soft)]
                                  hover:text-[var(--brand)]
                                  focus-visible:outline-none
                                  focus-visible:ring-2
                                  focus-visible:ring-[var(--brand)]
                                  focus-visible:ring-inset
                                  disabled:cursor-not-allowed
                                  disabled:opacity-40
                                "
                              >
                                <Plus
                                  size={14}
                                  strokeWidth={1.8}
                                />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-semibold text-[var(--text-primary)]">
                                ₦
                                {item.lineTotal.toLocaleString()}
                              </p>

                              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                                ₦
                                {item.unitPrice.toLocaleString()}{" "}
                                each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="
              shrink-0
              border-t
              border-[var(--border)]
              bg-white
              px-5
              py-5
            "
          >
            <div className="flex items-center justify-between gap-6">
              <span className="text-sm text-[var(--text-secondary)]">
                Subtotal
              </span>

              <span className="text-base font-semibold text-[var(--text-primary)]">
                ₦{activeCart.subtotal.toLocaleString()}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Shipping and tax are calculated at checkout.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="
                mt-4
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
              "
            >
              Checkout

              <ArrowRight
                size={16}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleViewCart}
              className="
                mt-3
                flex
                h-10
                w-full
                items-center
                justify-center
                text-sm
                font-medium
                text-[var(--text-secondary)]
                transition-colors
                duration-200
                hover:text-[var(--brand)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--brand)]
                focus-visible:ring-offset-2
              "
            >
              View cart
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
