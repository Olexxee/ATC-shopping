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
    <div className="border-b border-gray-200 py-6 first:pt-0 last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-32">
          {image ? (
            <img
              src={image}
              alt={product?.name || "Cart item"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {product?.name || "Product unavailable"}
              </h3>

              {product?.brand && (
                <p className="mt-1 text-xs text-gray-500">
                  {product.brand.name}
                </p>
              )}

              {variant && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                  {variant.color && (
                    <span className="rounded bg-gray-100 px-2 py-1">
                      Color: {variant.color}
                    </span>
                  )}

                  {variant.size && (
                    <span className="rounded bg-gray-100 px-2 py-1">
                      Size: {variant.size}
                    </span>
                  )}

                  <span className="rounded bg-gray-100 px-2 py-1">
                    SKU: {variant.sku}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.variantId)}
              disabled={isRemoving || isUpdating}
              aria-label={`Remove ${product?.name || "item"} from cart`}
              className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {item.unavailable && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              This item is no longer available.
            </div>
          )}

          {!item.unavailable && !item.inStock && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Only {item.availableStock}{" "}
              {item.availableStock === 1 ? "item" : "items"} available.
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.variantId, item.quantity - 1)
                }
                disabled={!canDecrease}
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 px-2 text-sm font-medium text-gray-900">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  onUpdateQuantity(item.variantId, item.quantity + 1)
                }
                disabled={!canIncrease}
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                ₦{item.unitPrice.toLocaleString()} each
              </p>

              <p className="mt-1 text-base font-semibold text-gray-900">
                ₦{item.lineTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
