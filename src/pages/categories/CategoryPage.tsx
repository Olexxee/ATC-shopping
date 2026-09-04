import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { ProductInfiniteLoader } from "../../components/product/ProductInfiniteLoader";
import { ProductListingHeader } from "../../components/product/ProductListingHeader";
import { ProductToolbar } from "../../components/product/ProductToolbar";
import { useCategoryBySlug } from "../../features/categories/categories.queries";
import { useInfiniteProducts } from "../../features/products/products.queries";
import { useProductDiscovery } from "../../features/products/useProductDiscovery";
import { mapProductsToCards } from "../../mappers/product.mapper";





export function CategoryPage() {
  const { slug = "" } = useParams();
  const categoryQuery = useCategoryBySlug(slug);
  const category = categoryQuery.data;
  const { state, setSort, clearFilters } = useProductDiscovery();
  const productsQuery = useInfiniteProducts({
    categoryId: category?.id,
    sortBy:
      state.sort === "newest"
        ? "createdAt"
        : state.sort.startsWith("price")
          ? "price"
          : state.sort.startsWith("name")
            ? "name"
            : undefined,
    sortOrder:
      state.sort === "price-asc" || state.sort === "name-asc" ? "asc" : "desc",
  });

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.data.products) ?? [],
    [productsQuery.data],
  );

  const productCards = useMemo(() => mapProductsToCards(products), [products]);

  const totalCount = productsQuery.data?.pages[0]?.meta.total ?? 0;

  if (categoryQuery.isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-100" />
          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-neutral-100" />

          <div className="mt-10">
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      </main>
    );
  }

  if (categoryQuery.isError || !category) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-20 text-center">
          <h1 className="text-xl font-semibold text-neutral-950">
            Category not found
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            The category you're looking for doesn't exist.
          </p>

          <Link
            to="/categories"
            className="mt-6 inline-block text-sm font-medium underline"
          >
            Browse all categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-12 sm:px-8 lg:px-12">
        {category.image && (
          <div className="relative aspect-[3/1] overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src={category.image.url}
              alt={category.image.alt ?? category.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Category
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {category.name}
              </h1>
            </div>
          </div>
        )}

        {!category.image && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Category
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              {category.name}
            </h1>

            {category.description && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500">
                {category.description}
              </p>
            )}
          </div>
        )}

        <div className="mt-10">
          <ProductListingHeader
            title={`Shop ${category.name}`}
            description={`${totalCount.toLocaleString()} ${
              totalCount === 1 ? "product" : "products"
            }`}
          />

          <div className="mt-2">
            <ProductToolbar
              resultCount={totalCount}
              state={state}
              onSortChange={setSort}
              onFiltersOpen={() => {
                // Mobile filters later.
              }}
              onClearFilters={clearFilters}
              showFilterButton
            />
          </div>
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
          ) : productCards.length ? (
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
