import type { ProductFormValues } from "../types/product-form.types";

interface ProductVisibilityProps {
  values: ProductFormValues;
  onChange: <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => void;
}

export function ProductVisibility({
  values,
  onChange,
}: ProductVisibilityProps) {
  return (
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
          description="Show this product in featured product areas."
          checked={values.isFeatured}
          onChange={(checked) => onChange("isFeatured", checked)}
        />

        <Toggle
          label="New product"
          description="Mark this product as a new arrival."
          checked={values.isNew}
          onChange={(checked) => onChange("isNew", checked)}
        />

        <Toggle
          label="Best seller"
          description="Mark this product as a best seller."
          checked={values.isBestSeller}
          onChange={(checked) => onChange("isBestSeller", checked)}
        />
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Status
        </label>

        <select
          value={values.status}
          onChange={(event) =>
            onChange(
              "status",
              event.target.value as ProductFormValues["status"],
            )
          }
          className="w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
        >
          <option value="DRAFT">Draft</option>

          <option value="ACTIVE">Active</option>

          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </section>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300"
      />
    </label>
  );
}
