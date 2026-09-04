import { useMemo } from "react";
import { BrandCard } from "../../components/brand/BrandCard";
import { Container } from "../../components/layout/Container";
import { Section } from "../../components/layout/Section";
import { useBrands } from "../../features/brands/brands.queries";
import { mapBrandsToCards } from "../../mappers/brand.mapper";

export function BrandsPage() {
  const brandsQuery = useBrands({
    page: 1,
    limit: 50,
    isActive: true,
  });

  const brands = useMemo(
    () => mapBrandsToCards(brandsQuery.data?.data ?? []),
    [brandsQuery.data],
  );

  return (
    <main className="min-h-screen bg-white">
      <Section>
        <Container>
          {/* Header */}
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Discover
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Shop by brand
            </h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
              Explore products from the brands available in our store.
            </p>
          </div>

          {/* Brand grid */}
          <div className="mt-10">
            {brandsQuery.isLoading ? (
              <BrandGridSkeleton />
            ) : brandsQuery.isError ? (
              <BrandsError onRetry={() => brandsQuery.refetch()} />
            ) : brands.length > 0 ? (
              <div className="grid grid-cols-2 border-l border-t border-neutral-200 sm:grid-cols-3 lg:grid-cols-4">
                {brands.map((brand) => (
                  <BrandCard key={brand.id} brand={brand} />
                ))}
              </div>
            ) : (
              <BrandsEmpty />
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}

function BrandGridSkeleton() {
  return (
    <div className="grid grid-cols-2 border-l border-t border-neutral-200 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="
            h-28
            animate-pulse
            border-b
            border-r
            border-neutral-200
            bg-neutral-50
            sm:h-32
          "
        />
      ))}
    </div>
  );
}

interface BrandsErrorProps {
  onRetry: () => void;
}

function BrandsError({ onRetry }: BrandsErrorProps) {
  return (
    <div className="py-20 text-center">
      <p className="text-sm font-medium text-neutral-900">
        Unable to load brands
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        Something went wrong while loading the brands.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-5
          text-sm
          font-medium
          text-neutral-900
          underline
          underline-offset-4
        "
      >
        Try again
      </button>
    </div>
  );
}

function BrandsEmpty() {
  return (
    <div className="py-20 text-center">
      <p className="text-sm font-medium text-neutral-900">
        No brands available
      </p>

      <p className="mt-2 text-sm text-neutral-500">
        There are currently no active brands to display.
      </p>
    </div>
  );
}