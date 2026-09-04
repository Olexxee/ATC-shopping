import type { ProductFormValues } from "../adminProducts.types";

interface ProductBasicInfoProps {
  values: ProductFormValues;
  onChange: (field: keyof ProductFormValues, value: string) => void;
}

export function ProductBasicInfo({ values, onChange }: ProductBasicInfoProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          Basic information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Information customers will see about this product.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="product-name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Product name
          </label>

          <input
            id="product-name"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Premium Leather Handbag"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="product-slug"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Slug
          </label>

          <input
            id="product-slug"
            value={values.slug}
            onChange={(event) =>
              onChange(
                "slug",
                event.target.value.toLowerCase().replace(/\s+/g, "-"),
              )
            }
            placeholder="premium-leather-handbag"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="product-description"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Description
          </label>

          <textarea
            id="product-description"
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            rows={5}
            placeholder="Describe the product..."
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
      </div>
    </section>
  );
}
