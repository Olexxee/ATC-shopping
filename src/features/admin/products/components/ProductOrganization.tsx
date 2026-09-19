import type { ProductFormValues } from "../types/product-form.types";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../hooks/useProductOptions";

interface ProductOrganizationProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => void;
}

export function ProductOrganization({
  values,
  onChange,
}: ProductOrganizationProps) {
  const { data: brands = [], isLoading: brandsLoading } = useProductBrands();

  const { data: categories = [], isLoading: categoriesLoading } =
    useProductCategories();

  const { data: collections = [], isLoading: collectionsLoading } =
    useProductCollections();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">Organization</h2>

        <p className="mt-1 text-sm text-slate-500">
          Assign the product to its catalog relationships.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            value={values.categoryId}
            onChange={(event) => onChange("categoryId", event.target.value)}
            disabled={categoriesLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select category"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Brand
          </label>

          <select
            value={values.brandId}
            onChange={(event) => onChange("brandId", event.target.value)}
            disabled={brandsLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
          >
            <option value="">
              {brandsLoading ? "Loading brands..." : "No brand"}
            </option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Collection
          </label>

          <select
            value={values.collectionId}
            onChange={(event) => onChange("collectionId", event.target.value)}
            disabled={collectionsLoading}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50"
          >
            <option value="">
              {collectionsLoading ? "Loading collections..." : "No collection"}
            </option>

            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
