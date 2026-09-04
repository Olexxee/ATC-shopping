import type { ProductVariantFormValues } from "../adminProducts.types";

interface ProductVariantFormProps {
  variant: ProductVariantFormValues;
  onChange: (variant: ProductVariantFormValues) => void;
  errors?: Record<string, string>;
  onSkuChange?: () => void;
  onRemove?: () => void;

  // 👇 NEW: all uploaded images (global) for selecting per variant
  allImages: File[];
}

export function ProductVariantForm({
  variant,
  onChange,
  errors = {},
  onSkuChange,
  onRemove,
  allImages,
}: ProductVariantFormProps) {
  const update = <K extends keyof ProductVariantFormValues>(
    field: K,
    value: ProductVariantFormValues[K],
  ) => {
    onChange({ ...variant, [field]: value });
  };

  // Toggle image selection for this variant
  const toggleImage = (index: number) => {
    const current = variant.imageIndexes;
    const newIndexes = current.includes(index)
      ? current.filter((i) => i !== index)
      : [...current, index].sort((a, b) => a - b);
    update("imageIndexes", newIndexes);
  };

  // Pre‑compute preview URLs (clean up on unmount would be ideal, but we keep it simple)
  const imagePreviews = allImages.map((file) => URL.createObjectURL(file));

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header with remove button */}
      <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Product variant
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Configure pricing, inventory, fulfillment and images for this
            variant.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              variant.isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {variant.isActive ? "Active" : "Inactive"}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="space-y-9 p-6">
        {/* Identification */}
        <FormSection
          title="Identification"
          description="Basic information used to identify this variant."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="SKU"
              hint="Automatically generated from product name. You can edit it."
              value={variant.sku}
              onChange={(value) => {
                update("sku", value);
                onSkuChange?.();
              }}
              placeholder="e.g. NIKE-AIR-MAX-270"
              error={errors.sku}
            />
            <Field
              label="Color"
              hint="Optional"
              value={variant.color}
              onChange={(value) => update("color", value)}
              placeholder="e.g. Black"
              error={errors.color}
            />
            <Field
              label="Size"
              hint="Optional"
              value={variant.size}
              onChange={(value) => update("size", value)}
              placeholder="e.g. Large"
              error={errors.size}
            />
          </div>
        </FormSection>

        {/* Pricing & inventory */}
        <FormSection
          title="Pricing & inventory"
          description="Set the selling price and available inventory."
        >
          <div className="grid gap-5 md:grid-cols-3">
            <NumberField
              label="Selling price"
              required
              prefix="₦"
              value={variant.price}
              onChange={(value) => update("price", value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              error={errors.price}
            />
            <NumberField
              label="Compare-at price"
              hint="Optional"
              prefix="₦"
              value={variant.compareAtPrice}
              onChange={(value) => update("compareAtPrice", value)}
              min={0}
              step={0.01}
              placeholder="Optional"
              error={errors.compareAtPrice}
            />
            <NumberField
              label="Stock"
              hint="Optional. Defaults to 0."
              value={variant.stock}
              onChange={(value) => update("stock", value)}
              min={0}
              step={1}
              placeholder="0"
              error={errors.stock}
            />
          </div>
        </FormSection>

        {/* Fulfillment & shipping */}
        <FormSection
          title="Fulfillment & shipping"
          description="Define how this variant is fulfilled and transported."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <SelectField
              label="Fulfillment type"
              value={variant.fulfillmentType}
              options={[
                { value: "LOCAL", label: "Local" },
                { value: "IMPORT", label: "Import" },
                { value: "PREORDER", label: "Preorder" },
                { value: "DIGITAL", label: "Digital" },
              ]}
              onChange={(value) => update("fulfillmentType", value as any)}
            />
            <SelectField
              label="Shipping type"
              value={variant.shippingType}
              options={[
                { value: "LOCAL", label: "Local" },
                { value: "IMPORT", label: "Import" },
                { value: "SEA", label: "Sea freight" },
                { value: "AIR", label: "Air freight" },
                { value: "DIGITAL", label: "Digital" },
              ]}
              onChange={(value) => update("shippingType", value as any)}
            />
          </div>
        </FormSection>

        {/* Physical details */}
        <FormSection
          title="Physical details"
          description="Used for inventory and shipping calculations."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <NumberField
              label="Weight"
              required
              hint="Product weight."
              value={variant.weight}
              onChange={(value) => update("weight", value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              suffix="kg"
              error={errors.weight}
            />
            <NumberField
              label="Actual weight"
              required
              hint="Actual shipping weight."
              value={variant.actualWeight}
              onChange={(value) => update("actualWeight", value)}
              min={0}
              step={0.01}
              placeholder="0.00"
              suffix="kg"
              error={errors.actualWeight}
            />
          </div>
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-900">Dimensions</p>
              <p className="mt-1 text-xs text-slate-400">
                Optional. Leave blank if dimensions are not applicable.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <NumberField
                label="Length"
                value={variant.length}
                onChange={(value) => update("length", value)}
                min={0}
                step={0.01}
                placeholder="Optional"
                suffix="cm"
                error={errors.length}
              />
              <NumberField
                label="Width"
                value={variant.width}
                onChange={(value) => update("width", value)}
                min={0}
                step={0.01}
                placeholder="Optional"
                suffix="cm"
                error={errors.width}
              />
              <NumberField
                label="Height"
                value={variant.height}
                onChange={(value) => update("height", value)}
                min={0}
                step={0.01}
                placeholder="Optional"
                suffix="cm"
                error={errors.height}
              />
            </div>
          </div>
        </FormSection>

        {/* ── IMAGE SELECTOR ── */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Select images for this variant
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose which uploaded images belong to this variant.
            </p>
          </div>

          {allImages.length === 0 ? (
            <p className="text-sm text-slate-400">
              No images uploaded yet. Upload images in the “Product images”
              section above.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {allImages.map((file, idx) => {
                const url = URL.createObjectURL(file);
                const checked = variant.imageIndexes.includes(idx);
                return (
                  <label
                    key={idx}
                    className={`relative aspect-square w-20 cursor-pointer overflow-hidden rounded-lg border-2 ${
                      checked ? "border-slate-900" : "border-slate-200"
                    } hover:border-slate-400`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleImage(idx)}
                      className="absolute bottom-1 right-1 h-4 w-4 accent-slate-900"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Status toggle */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Variant availability
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Inactive variants remain in the catalog but cannot be purchased.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={variant.isActive}
              onClick={() => update("isActive", !variant.isActive)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                variant.isActive ? "bg-slate-900" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  variant.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Sub‑components (unchanged except for minor styling)
   -------------------------------------------------------------------------- */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
          error ? "border-red-400" : "border-slate-300"
        }`}
      />
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  hint,
  required = false,
  value,
  onChange,
  min,
  step = 1,
  placeholder,
  prefix,
  suffix,
  error,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
            prefix ? "pl-9" : "px-4"
          } ${suffix ? "pr-12" : "pr-4"} ${
            error ? "border-red-400" : "border-slate-300"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
