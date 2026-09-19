import type { AdminProductDetail } from "../../../../api/product/product.contract";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../hooks/useProductOptions";

interface Props {
  values: AdminProductDetail;
  onChange: <K extends keyof AdminProductDetail>(
    field: K,
    value: AdminProductDetail[K],
  ) => void;
}

export function ProductScalars({ values, onChange }: Props) {
  const { data: brands = [], isLoading: brandsLoading } = useProductBrands();
  const { data: categories = [], isLoading: categoriesLoading } =
    useProductCategories();
  const { data: collections = [], isLoading: collectionsLoading } =
    useProductCollections();

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">
            Basic information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Product name, URL slug and description.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product name
            </label>
            <input
              type="text"
              value={values.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Slug
            </label>
            <input
              type="text"
              value={values.slug}
              onChange={(e) => onChange("slug", e.target.value.toLowerCase())}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={6}
              value={values.description ?? ""}
              onChange={(e) => onChange("description", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">
            Organization
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Category, brand and collection.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              value={values.categoryId}
              onChange={(e) => onChange("categoryId", e.target.value)}
              disabled={categoriesLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Brand
            </label>
            <select
              value={values.brandId ?? ""}
              onChange={(e) => onChange("brandId", e.target.value || null)}
              disabled={brandsLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">No brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Collection
            </label>
            <select
              value={values.collectionId ?? ""}
              onChange={(e) => onChange("collectionId", e.target.value || null)}
              disabled={collectionsLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
            >
              <option value="">No collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900">Visibility</h2>
          <p className="mt-1 text-sm text-slate-500">
            Control how this product appears in the catalog.
          </p>
        </div>

        <div className="space-y-3">
          <Toggle
            label="Featured"
            checked={values.isFeatured}
            onChange={(v) => onChange("isFeatured", v)}
          />
          <Toggle
            label="New product"
            checked={values.isNew}
            onChange={(v) => onChange("isNew", v)}
          />
          <Toggle
            label="Best seller"
            checked={values.isBestSeller}
            onChange={(v) => onChange("isBestSeller", v)}
          />
        </div>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            value={values.status}
            onChange={(e) =>
              onChange("status", e.target.value as AdminProductDetail["status"])
            }
            className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </section>
    </>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-slate-300"
      />
    </label>
  );
}
