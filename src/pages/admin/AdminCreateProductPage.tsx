import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateProduct } from "../../features/admin/products/hooks/useCreateProduct";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../../features/admin/products/hooks/useProductOptions";

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

  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.slug.trim()) return setError("Slug is required.");
    if (!form.categoryId) return setError("Category is required.");

    try {
      const product = await createMutation.mutateAsync({
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim() || null,
        categoryId: form.categoryId,
        brandId: form.brandId || null,
        collectionId: form.collectionId || null,
        status: form.status,
      });

      // Redirect to edit page — the admin adds variants there.
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
          Add the product basics. You'll add variants on the next screen.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
      >
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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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

        <div className="flex justify-end pt-4">
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
