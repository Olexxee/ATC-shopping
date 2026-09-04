import { useMemo } from "react";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { ProductInfiniteLoader } from "../../components/product/ProductInfiniteLoader";
import { ProductListingHeader } from "../../components/product/ProductListingHeader";
import { ProductToolbar } from "../../components/product/ProductToolbar";
import { useInfiniteProducts } from "../../features/products/products.queries";
import { useProductDiscovery } from "../../features/products/useProductDiscovery";
import { mapProductsToCards } from "../../mappers/product.mapper";


export function ProductsPage() {
  const { state, params, setSort, clearFilters } = useProductDiscovery();

  const productsQuery = useInfiniteProducts(params);

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.data.products) ?? [],
    [productsQuery.data],
  );

  const productCards = useMemo(() => mapProductsToCards(products), [products]);

  const totalCount = productsQuery.data?.pages[0]?.meta.total ?? 0;

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
  }, [state.search, state.isFeatured, state.isNew, state.isBestSeller]);

  const hasFilters =
    Boolean(state.categoryId) ||
    Boolean(state.brandId) ||
    Boolean(state.collectionId) ||
    Boolean(state.isFeatured) ||
    Boolean(state.isNew) ||
    Boolean(state.isBestSeller) ||
    state.minPrice !== undefined ||
    state.maxPrice !== undefined;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12">
        <ProductListingHeader
          title={pageTitle}
          description={
            productsQuery.isLoading
              ? undefined
              : `${totalCount.toLocaleString()} ${
                  totalCount === 1 ? "product" : "products"
                }`
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
            onClearFilters={hasFilters ? clearFilters : undefined}
            showFilterButton
          />
        </div>

        <div className="mt-10">
          {productsQuery.isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : productsQuery.isError ? (
            <div className="py-12 text-center">
              <p className="text-sm text-red-600">Failed to load products.</p>

              <button
                type="button"
                onClick={() => productsQuery.refetch()}
                className="mt-3 text-sm font-medium underline"
              >
                Try again
              </button>
            </div>
          ) : productCards.length > 0 ? (
            <ProductGrid products={productCards} />
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
