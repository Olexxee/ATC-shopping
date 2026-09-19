import type { ProductFormValues } from "../types/product-form.types";

interface ProductBasicInformationProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => void;
}

export function ProductBasicInformation({
  values,
  onChange,
}: ProductBasicInformationProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-900">
          Basic information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Define the product name, URL slug, and description.
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
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Samsung Galaxy S25"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug
          </label>

          <input
            type="text"
            value={values.slug}
            onChange={(event) =>
              onChange("slug", event.target.value.toLowerCase())
            }
            placeholder="samsung-galaxy-s25"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={6}
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Describe the product..."
            className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </section>
  );
}
