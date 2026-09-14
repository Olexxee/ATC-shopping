import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import type { WishlistItem } from "../../features/wishlist/wishlist.types";

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (productId: string) => void;
  isRemoving?: boolean;
}

export function WishlistItemCard({
  item,
  onRemove,
  isRemoving = false,
}: WishlistItemCardProps) {
  const product = item.product;

  if (!product) {
    return null;
  }

  const variant = product.variants[0] ?? null;
  const image = variant?.media?.[0]?.url ?? null;

  const variantDetails = [variant?.color, variant?.size].filter(Boolean);

  const unavailable =
    product.status !== "ACTIVE" || !variant || variant.stock <= 0;

  return (
    <article className="group min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <Link to={`/products/${product.slug}`} className="block h-full">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <span className="text-sm text-neutral-400">
                Image unavailable
              </span>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-900 shadow-sm">
              New
            </span>
          )}

          {product.isBestSeller && (
            <span className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
              Bestseller
            </span>
          )}

          {unavailable && (
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-600 shadow-sm">
              Unavailable
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(product.id)}
          disabled={isRemoving}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Heart size={17} fill="currentColor" strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-4">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {product.brand.name}
          </p>
        )}

        <Link
          to={`/products/${product.slug}`}
          className="mt-1 block truncate text-sm font-medium text-neutral-950 hover:underline"
        >
          {product.name}
        </Link>

        <div className="mt-2">
          {variant ? (
            <span className="text-sm font-semibold text-neutral-950">
              ₦{variant.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-sm text-neutral-400">Price unavailable</span>
          )}
        </div>

        {variantDetails.length > 0 && (
          <p className="mt-2 truncate text-xs text-neutral-400">
            {variantDetails.join(" · ")}
          </p>
        )}

        {variant && (
          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-xs ${
                variant.stock > 0 ? "text-neutral-500" : "text-red-500"
              }`}
            >
              {variant.stock > 0
                ? `${variant.stock} available`
                : "Out of stock"}
            </span>

            {!unavailable && (
              <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-900 hover:underline"
              >
                <ShoppingBag size={14} />
                View product
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
