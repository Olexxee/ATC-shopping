import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useCreateProduct } from "../../features/admin/products/hooks/useCreateProduct";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../../features/admin/products/hooks/useProductOptions";
import type {
  ProductFulfillmentType,
  ProductShippingType,
} from "../../features/admin/products/api/product.api";

interface VariantFormState {
  sku: string;
  color: string;
  size: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  weight: string;
  actualWeight: string;
  length: string;
  width: string;
  height: string;
  fulfillmentType: ProductFulfillmentType;
  shippingType: ProductShippingType;
  images: File[];
}

const createEmptyVariant = (): VariantFormState => ({
  sku: "",
  color: "",
  size: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  weight: "",
  actualWeight: "",
  length: "",
  width: "",
  height: "",
  fulfillmentType: "LOCAL",
  shippingType: "LOCAL",
  images: [],
});

const toNumber = (value: string, field: string): number => {
  const parsed = Number(value);
  if (!value.trim() || !Number.isFinite(parsed)) {
    throw new Error(`${field} must be a valid number`);
  }
  return parsed;
};

const toOptionalNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error("Invalid numeric value");
  return parsed;
};

export function AdminCreateProductPage() {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const { data: brands = [] } = useProductBrands();
  const { data: categories = [] } = useProductCategories();
  const { data: collections = [] } = useProductCollections();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    brandId: "",
    collectionId: "",
    status: "DRAFT" as const,
  });

  const [variants, setVariants] = useState<VariantFormState[]>([
    createEmptyVariant(),
  ]);

  const [error, setError] = useState("");

  const updateVariant = (index: number, patch: Partial<VariantFormState>) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    );
  };

  const addVariant = () =>
    setVariants((prev) => [...prev, createEmptyVariant()]);

  const removeVariant = (index: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.slug.trim()) return setError("Slug is required.");
    if (!form.categoryId) return setError("Category is required.");
    if (variants.length === 0)
      return setError("At least one variant is required.");

    try {
      // Flatten all variant images into one file list, and track each
      // variant's slice of it via imageIndexes so the backend can
      // re-associate uploaded files with the right variant.
      const allImages: File[] = [];
      const variantInputs = variants.map((v) => {
        const startIndex = allImages.length;
        allImages.push(...v.images);
        const imageIndexes = v.images.map((_, i) => startIndex + i);

        return {
          sku: v.sku.trim() || undefined,
          color: v.color.trim() || undefined,
          size: v.size.trim() || undefined,

          price: toNumber(v.price, "Price"),
          compareAtPrice: toOptionalNumber(v.compareAtPrice),
          stock: Number.parseInt(v.stock || "0", 10),

          weight: toNumber(v.weight, "Weight"),
          actualWeight: toNumber(v.actualWeight, "Actual weight"),

          length: toOptionalNumber(v.length),
          width: toOptionalNumber(v.width),
          height: toOptionalNumber(v.height),

          fulfillmentType: v.fulfillmentType,
          shippingType: v.shippingType,

          isActive: true,
          imageIndexes,
        };
      });

      const product = await createMutation.mutateAsync({
        product: {
          name: form.name.trim(),
          slug: form.slug.trim().toLowerCase(),
          description: form.description.trim() || null,
          categoryId: form.categoryId,
          brandId: form.brandId || null,
          collectionId: form.collectionId || null,
          status: form.status,
          variants: variantInputs,
        },
        images: allImages,
      });

      navigate(`/admin/products/${product.id}/edit`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>

        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          Create product
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add the product basics and at least one variant. You can add more
          variants later from the edit screen.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Field
            label="Slug"
            value={form.slug}
            onChange={(v) => setForm({ ...form, slug: v.toLowerCase() })}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(v) => setForm({ ...form, categoryId: v })}
              options={categories}
              placeholder="Select category"
            />
            <Select
              label="Brand"
              value={form.brandId}
              onChange={(v) => setForm({ ...form, brandId: v })}
              options={brands}
              placeholder="No brand"
            />
            <Select
              label="Collection"
              value={form.collectionId}
              onChange={(v) => setForm({ ...form, collectionId: v })}
              options={collections}
              placeholder="No collection"
            />
          </div>
        </div>

        <div className="space-y-5">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Variant {index + 1}
                </h2>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="SKU"
                  value={variant.sku}
                  onChange={(v) => updateVariant(index, { sku: v })}
                />
                <Field
                  label="Color"
                  value={variant.color}
                  onChange={(v) => updateVariant(index, { color: v })}
                />
                <Field
                  label="Size"
                  value={variant.size}
                  onChange={(v) => updateVariant(index, { size: v })}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="Price"
                  value={variant.price}
                  onChange={(v) => updateVariant(index, { price: v })}
                  type="number"
                  required
                />
                <Field
                  label="Compare-at price"
                  value={variant.compareAtPrice}
                  onChange={(v) => updateVariant(index, { compareAtPrice: v })}
                  type="number"
                />
                <Field
                  label="Stock"
                  value={variant.stock}
                  onChange={(v) => updateVariant(index, { stock: v })}
                  type="number"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="Weight (kg)"
                  value={variant.weight}
                  onChange={(v) => updateVariant(index, { weight: v })}
                  type="number"
                  required
                />
                <Field
                  label="Actual weight (kg)"
                  value={variant.actualWeight}
                  onChange={(v) => updateVariant(index, { actualWeight: v })}
                  type="number"
                  required
                />
                <Select
                  label="Fulfillment"
                  value={variant.fulfillmentType}
                  onChange={(v) =>
                    updateVariant(index, {
                      fulfillmentType: v as ProductFulfillmentType,
                    })
                  }
                  options={[
                    { id: "LOCAL", name: "Local" },
                    { id: "IMPORT", name: "Import" },
                    { id: "PREORDER", name: "Preorder" },
                    { id: "DIGITAL", name: "Digital" },
                  ]}
                  placeholder="Select"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <Field
                  label="Length (cm)"
                  value={variant.length}
                  onChange={(v) => updateVariant(index, { length: v })}
                  type="number"
                />
                <Field
                  label="Width (cm)"
                  value={variant.width}
                  onChange={(v) => updateVariant(index, { width: v })}
                  type="number"
                />
                <Field
                  label="Height (cm)"
                  value={variant.height}
                  onChange={(v) => updateVariant(index, { height: v })}
                  type="number"
                />
                <Select
                  label="Shipping"
                  value={variant.shippingType}
                  onChange={(v) =>
                    updateVariant(index, {
                      shippingType: v as ProductShippingType,
                    })
                  }
                  options={[
                    { id: "LOCAL", name: "Local" },
                    { id: "IMPORT", name: "Import" },
                    { id: "SEA", name: "Sea" },
                    { id: "AIR", name: "Air" },
                    { id: "DIGITAL", name: "Digital" },
                  ]}
                  placeholder="Select"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    updateVariant(index, {
                      images: Array.from(e.target.files ?? []),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
          >
            <Plus size={16} /> Add another variant
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {createMutation.isPending && (
              <Loader2 size={16} className="animate-spin" />
            )}
            Create product
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
