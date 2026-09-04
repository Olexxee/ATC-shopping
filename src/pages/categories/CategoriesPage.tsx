import { useMemo } from "react";
import { CategoryCard } from "../../components/category/CategoryCard";
import { Container } from "../../components/layout/Container";
import { Section } from "../../components/layout/Section";
import { useCategories } from "../../features/categories/categories.queries";
import { mapCategoriesToCards } from "../../mappers/category.mapper";



export function CategoriesPage() {
  const categoriesQuery = useCategories({
    type: "PRODUCT",
    isActive: true,
    limit: 100,
  });

  const categories = useMemo(
    () => mapCategoriesToCards(categoriesQuery.data?.data ?? []),
    [categoriesQuery.data],
  );

  return (
    <main className="min-h-screen bg-white">
      <Section>
        <Container>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Explore
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Shop by category
            </h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500 sm:text-base">
              Explore our collection by category and discover products selected
              for you.
            </p>
          </div>

          <div className="mt-10">
            {categoriesQuery.isLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[4/5] animate-pulse rounded-2xl bg-neutral-100"
                  />
                ))}
              </div>
            ) : categoriesQuery.isError ? (
              <div className="py-16 text-center">
                <p className="text-sm text-red-600">
                  Failed to load categories.
                </p>

                <button
                  type="button"
                  onClick={() => categoriesQuery.refetch()}
                  className="mt-3 text-sm font-medium underline"
                >
                  Try again
                </button>
              </div>
            ) : categories.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-sm text-neutral-500">
                  No categories available.
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}
