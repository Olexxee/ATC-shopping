import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../features/cart/cart.types";

interface CartItemCardProps {
  item: CartItem;
  isUpdating: boolean;
  isRemoving: boolean;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}

export default function CartItemCard({
  item,
  isUpdating,
  isRemoving,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const variant = item.variant;
  const product = variant?.product;

  const image =
    variant?.images?.find((media) => media.isPrimary)?.url ||
    variant?.images?.[0]?.url ||
    null;

  const canIncrease =
    !isRemoving && item.quantity < item.availableStock && !item.unavailable;

  const canDecrease = !isRemoving && item.quantity > 1;

  return (
    <div className="border-b border-[var(--border)] py-6 first:pt-0 last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface)] sm:h-32 sm:w-32">
          {image ? (
            <img
              src={image}
              alt={product?.name || "Cart item"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-[var(--text-muted)]">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-[var(--text-primary)] sm:text-base">
                {product?.name || "Product unavailable"}
              </h3>

              {product?.brand && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {product.brand.name}
                </p>
              )}

              {variant && (
                <div className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                  {variant.color && (
                    <p>
                      <span className="text-[var(--text-secondary)]">
                        Color:
                      </span>{" "}
                      {variant.color}
                    </p>
                  )}

                  {variant.size && (
                    <p>
                      <span className="text-[var(--text-secondary)]">
                        Size:
                      </span>{" "}
                      {variant.size}
                    </p>
                  )}

                  <p>
                    <span className="text-[var(--text-secondary)]">SKU:</span>{" "}
                    {variant.sku}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.variantId)}
              disabled={isRemoving || isUpdating}
              aria-label={`Remove ${product?.name || "item"} from cart`}
              className="
                shrink-0
                p-1.5
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
              <Trash2 size={17} strokeWidth={1.8} />
            </button>
          </div>

          {item.unavailable && (
            <div className="mt-3 border-l-2 border-[var(--error)] bg-red-50 px-3 py-2 text-xs text-[var(--error)]">
              This item is no longer available.
            </div>
          )}

          {!item.unavailable && !item.inStock && (
            <div className="mt-3 border-l-2 border-[var(--warning)] bg-amber-50 px-3 py-2 text-xs text-[var(--warning)]">
              Only {item.availableStock}{" "}
              {item.availableStock === 1 ? "item" : "items"} available.
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center border border-[var(--border)]">
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.variantId, item.quantity - 1)
                }
                disabled={!canDecrease}
                aria-label="Decrease quantity"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-[var(--text-secondary)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface)]
                  hover:text-[var(--text-primary)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-inset
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Minus size={15} strokeWidth={1.8} />
              </button>

              <span className="flex h-9 min-w-10 items-center justify-center border-x border-[var(--border)] px-2 text-sm font-medium text-[var(--text-primary)]">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.variantId, item.quantity + 1)
                }
                disabled={!canIncrease}
                aria-label="Increase quantity"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  text-[var(--text-secondary)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--surface)]
                  hover:text-[var(--text-primary)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand)]
                  focus-visible:ring-inset
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <Plus size={15} strokeWidth={1.8} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">
                ₦{item.unitPrice.toLocaleString()} each
              </p>

              <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">
                ₦{item.lineTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}