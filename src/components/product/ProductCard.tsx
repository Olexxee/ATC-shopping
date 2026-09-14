import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProductCardData } from "../../types/product-ui";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../features/wishlist/wishlist.mutations";

interface ProductCardProps {
  product: ProductCardData;
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

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      navigate("/auth/login", {
        state: {
          from: `/products/${product.slug}`,
        },
      });

      return;
    }

    const previousState = optimisticWishlist;
    const nextState = !previousState;

    // Update the UI immediately.
    setOptimisticWishlist(nextState);

    if (nextState) {
      addToWishlistMutation.mutate(
        {
          productId: product.id,
        },
        {
          onError: () => {
            // Roll back if the API request fails.
            setOptimisticWishlist(previousState);
          },
        },
      );

      return;
    }

    removeFromWishlistMutation.mutate(product.id, {
      onError: () => {
        // Roll back if the API request fails.
        setOptimisticWishlist(previousState);
      },
    });
  };

  return (
    <article className="group min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <a href={`/products/${product.slug}`} className="block h-full">
          {product.image ? (
            <img
              src={product.image}
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
        </a>

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
        </div>

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
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
            optimisticWishlist
              ? "bg-white text-red-500 hover:bg-red-50"
              : "bg-white text-neutral-700 hover:bg-neutral-950 hover:text-white"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Heart
            size={17}
            fill={optimisticWishlist ? "currentColor" : "none"}
            strokeWidth={optimisticWishlist ? 2.5 : 2}
          />
        </button>
      </div>

      <div className="mt-4">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {product.brand}
          </p>
        )}

        <a
          href={`/products/${product.slug}`}
          className="mt-1 block truncate text-sm font-medium text-neutral-950 hover:underline"
        >
          {product.name}
        </a>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-950">
            ₦{product.price.toLocaleString()}
          </span>

          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-neutral-400 line-through">
              ₦{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        {product.hasVariants && (
          <div className="mt-2">
            <p className="text-xs text-neutral-500">
              {product.variantCount}{" "}
              {product.variantCount === 1 ? "variant" : "variants"}
            </p>

            {product.colors.length > 0 && (
              <p className="mt-0.5 truncate text-xs text-neutral-400">
                {product.colors.join(" · ")}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
