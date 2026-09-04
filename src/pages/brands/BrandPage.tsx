import { Link, useParams } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { Section } from "../../components/layout/Section";
import { ProductGrid } from "../../components/product/ProductGrid";
import { ProductGridSkeleton } from "../../components/product/ProductGridSkeleton";
import { ProductInfiniteLoader } from "../../components/product/ProductInfiniteLoader";
import { useBrandBySlug } from "../../features/brands/brands.queries";
import { useInfiniteProducts } from "../../features/products/products.queries";
import { mapBrandToCard } from "../../mappers/brand.mapper";
import { mapProductsToCards } from "../../mappers/product.mapper";

export function BrandPage() {
  const { slug } = useParams<{ slug: string }>();

  const brandQuery = useBrandBySlug(slug ?? "");

  const brand = brandQuery.data;

  const productsQuery = useInfiniteProducts({
    brandId: brand?.id,
    limit: 20,
  });

  const brandCard = brand
    ? mapBrandToCard(brand)
    : null;

  const products =
    productsQuery.data?.pages.flatMap(
      (page) => page.data.products,
    ) ?? [];

  const productCards = mapProductsToCards(products);

  if (brandQuery.isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Section>
          <Container>
            <div className="animate-pulse">
              <div className="h-4 w-32 rounded bg-neutral-100" />

              <div className="mt-8 h-24 w-24 rounded-2xl bg-neutral-100" />

              <div className="mt-5 h-8 w-64 rounded bg-neutral-100" />

              <div className="mt-3 h-5 w-full max-w-xl rounded bg-neutral-100" />
            </div>

            <div className="mt-12">
              <ProductGridSkeleton count={8} />
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  if (brandQuery.isError || !brandCard) {
    return (
      <main className="min-h-screen bg-white">
        <Section>
          <Container>
            <div className="py-20 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Brand
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                Brand not found
              </h1>

              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">
                We couldn't find the brand you're looking for.
              </p>

              <Link
                to="/brands"
                className="
                  mt-8
                  inline-flex
                  text-sm
                  font-medium
                  text-neutral-900
                  underline
                  underline-offset-4
                "
              >
                Browse all brands
              </Link>
            </div>
          </Container>
        </Section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Section>
        <Container>
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500">
            <Link
              to="/brands"
              className="transition-colors hover:text-neutral-950"
            >
              Brands
            </Link>

            <span className="mx-2">/</span>

            <span className="text-neutral-900">
              {brandCard.name}
            </span>
          </nav>

          {/* Brand header */}
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-4">
              {brandCard.logo ? (
                <img
                  src={brandCard.logo}
                  alt={brandCard.name}
                  loading="eager"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-3xl font-semibold text-neutral-400">
                  {brandCard.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Brand
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                {brandCard.name}
              </h1>

              {brandCard.description && (
                <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
                  {brandCard.description}
                </p>
              )}

              {brandCard.productCount !== undefined && (
                <p className="mt-3 text-sm text-neutral-500">
                  {brandCard.productCount}{" "}
                  {brandCard.productCount === 1
                    ? "product"
                    : "products"}
                </p>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="mt-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Collection
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                Shop {brandCard.name}
              </h2>
            </div>

            <div className="mt-8">
              {productsQuery.isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : productsQuery.isError ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-red-600">
                    Failed to load products.
                  </p>

                  <button
                    type="button"
                    onClick={() => productsQuery.refetch()}
                    className="mt-3 text-sm font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              ) : productCards.length ? (
                <>
                  <ProductGrid products={productCards} />

                  <ProductInfiniteLoader
                    hasNextPage={
                      productsQuery.hasNextPage
                    }
                    isFetchingNextPage={
                      productsQuery.isFetchingNextPage
                    }
                    onLoadMore={() =>
                      productsQuery.fetchNextPage()
                    }
                  />
                </>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-sm text-neutral-500">
                    This brand doesn't have any products yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}