import { useMemo } from "react";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { ProductInfiniteLoader } from "../../components/product/ProductInfiniteLoader";
import { ProductListingHeader } from "../../components/product/ProductListingHeader";
import { ProductToolbar } from "../../components/product/ProductToolbar";
import { useInfiniteProducts } from "../../features/products/products.queries";
import { useProductDiscovery } from "../../features/products/useProductDiscovery";

export function ProductsPage() {
  const { state, params, setSort } = useProductDiscovery();

  const productsQuery = useInfiniteProducts(params);

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.products) ?? [],
    [productsQuery.data],
  );

  const totalCount = productsQuery.data?.pages[0]?.pagination?.total ?? 0;

  const pageTitle = useMemo(() => {
    if (state.search) {
      return `Search results for "${state.search}"`;
    }

    if (state.isFeatured) {
      return "Featured products";
    }

    if (state.isNew) {
      return "New arrivals";
    }

    if (state.isBestSeller) {
      return "Best sellers";
    }

    return "All products";
  }, [
    state.search,
    state.isFeatured,
    state.isNew,
    state.isBestSeller,
  ]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <ProductListingHeader
          title={pageTitle}
          description={
            state.search
              ? "Explore products matching your search."
              : "Explore the full Keplex collection."
          }
        />

        <div className="mt-2">
          <ProductToolbar
            resultCount={totalCount}
            state={state}
            onSortChange={setSort}
            onFiltersOpen={() => {
              // Mobile filters will be wired here.
            }}
            showFilterButton
          />
        </div>

        <div className="mt-10">
          {productsQuery.isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : productsQuery.isError ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 text-center">
              <div>
                <p className="text-sm font-medium text-[var(--error)]">
                  Failed to load products.
                </p>

                <button
                  type="button"
                  onClick={() => productsQuery.refetch()}
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-[var(--text-primary)]
                    underline
                    underline-offset-4
                    transition-colors
                    duration-200
                    hover:text-[var(--brand)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand)]
                    focus-visible:ring-offset-2
                  "
                >
                  Try again
                </button>
              </div>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <ProductEmptyState />
          )}
        </div>

        <ProductInfiniteLoader
          hasNextPage={Boolean(productsQuery.hasNextPage)}
          isFetchingNextPage={productsQuery.isFetchingNextPage}
          onLoadMore={() => productsQuery.fetchNextPage()}
        />
      </div>
    </main>
  );
}