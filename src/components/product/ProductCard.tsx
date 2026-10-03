import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { StorefrontCard } from "../../api/product/product.contract";
import { ReviewStars } from "../review/ReviewStars";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../features/wishlist/wishlist.mutations";

interface ProductCardProps {
  product: StorefrontCard;
  isAuthenticated: boolean;
  isInWishlist: boolean;
  wishlistLoading?: boolean;
}

export function ProductCard({
  product,
  isAuthenticated,
  isInWishlist,
  wishlistLoading = false,
}: ProductCardProps) {
  const navigate = useNavigate();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const [optimisticWishlist, setOptimisticWishlist] = useState(isInWishlist);

  const isMutating =
    addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  useEffect(() => {
    setOptimisticWishlist(isInWishlist);
  }, [isInWishlist]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: { from: `/products/${product.slug}` },
      });
      return;
    }

    const previousState = optimisticWishlist;
    const nextState = !previousState;

    setOptimisticWishlist(nextState);

    if (nextState) {
      addToWishlistMutation.mutate(
        { productId: product.id },
        { onError: () => setOptimisticWishlist(previousState) },
      );
      return;
    }

    removeFromWishlistMutation.mutate(product.id, {
      onError: () => setOptimisticWishlist(previousState),
    });
  };

  // Price comes ONLY from priceRange. No fallback to a variant.
  const price = product.priceRange.min;

  // Compare-at shown only when a real markdown exists.
  const compareAt = (() => {
    const candidates = product.variants
      .map((v) => v.compareAtPrice)
      .filter((c): c is number => c !== null && c > price);

    return candidates.length ? Math.max(...candidates) : null;
  })();

  return (
    <article className="group min-w-0">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface)]">
        <Link to={`/products/${product.slug}`} className="block h-full">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-300
                ease-out
                group-hover:scale-[1.03]
              "
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <span className="text-sm text-[var(--text-muted)]">
                Image unavailable
              </span>
            </div>
          )}
        </Link>

        {/* Product badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.isNew && (
            <span
              className="
                rounded-full
                bg-white
                px-2.5
                py-1
                text-[11px]
                font-medium
                leading-none
                text-[var(--text-primary)]
                shadow-sm
              "
            >
              New
            </span>
          )}

          {product.isBestSeller && (
            <span
              className="
                rounded-full
                bg-[var(--foreground)]
                px-2.5
                py-1
                text-[11px]
                font-medium
                leading-none
                text-white
              "
            >
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={wishlistLoading || isMutating}
          aria-label={
            optimisticWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={optimisticWishlist}
          className={`
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            shadow-sm
            transition-colors
            duration-200
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--brand)]
            focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${
              optimisticWishlist
                ? "text-[var(--brand)] hover:bg-[var(--brand-soft)]"
                : "text-[var(--text-primary)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
            }
          `}
        >
          <Heart
            size={17}
            fill={optimisticWishlist ? "currentColor" : "none"}
            strokeWidth={optimisticWishlist ? 2.5 : 2}
          />
        </button>
      </div>

      {/* Product information */}
      <div className="mt-4">
        {product.brand && (
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-[var(--text-muted)]
            "
          >
            {product.brand}
          </p>
        )}

        <Link
          to={`/products/${product.slug}`}
          className="
            mt-1
            block
            truncate
            text-sm
            font-medium
            leading-snug
            text-[var(--text-primary)]
            transition-colors
            duration-200
            hover:text-[var(--brand)]
          "
        >
          {product.name}
        </Link>

        {product.totalReviews > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <ReviewStars rating={product.avgRating} size="sm" />

            <span className="text-xs text-[var(--text-muted)]">
              ({product.totalReviews.toLocaleString()})
            </span>
          </div>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span
            className="
              text-sm
              font-semibold
              leading-normal
              text-[var(--text-primary)]
            "
          >
            ₦{price.toLocaleString()}
          </span>

          {compareAt && compareAt > price && (
            <span
              className="
                text-xs
                text-[var(--text-muted)]
                line-through
              "
            >
              ₦{compareAt.toLocaleString()}
            </span>
          )}
        </div>

        {product.variants.length > 1 && (
          <div className="mt-2">
            <p className="text-xs text-[var(--text-muted)]">
              {product.variants.length} variants
            </p>

            {product.colors.length > 0 && (
              <p className="mt-0.5 truncate text-xs text-[var(--text-disabled)]">
                {product.colors.join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
