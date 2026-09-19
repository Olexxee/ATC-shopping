import { useMemo } from "react";
import type { StorefrontCard } from "../../api/product/product.contract";
import { useCurrentUser } from "../../features/auth/auth.queries";
import { useBatchWishlistCheck } from "../../features/wishlist/wishlist.queries";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: StorefrontCard[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { data: user, isLoading: authLoading } = useCurrentUser();

  const productIds = useMemo(
    () => [...new Set(products.map((product) => product.id))],
    [products],
  );

  const isAuthenticated = !authLoading && Boolean(user);

  const { data: wishlistStatus, isLoading: wishlistLoading } =
    useBatchWishlistCheck(productIds, isAuthenticated);

  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
          isInWishlist={wishlistStatus?.[product.id] ?? false}
          wishlistLoading={wishlistLoading}
        />
      ))}
    </div>
  );
}
