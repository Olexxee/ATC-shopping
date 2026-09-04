import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import type { AdminCategory, CategoryFormValues } from "../category.types";
import { useAdminCategories } from "../category.queries";

interface CategoryFormProps {
  mode: "create" | "edit";
  category?: AdminCategory;
  isSubmitting: boolean;
  onSubmit: (values: CategoryFormValues) => void; // image is handled by parent
  error?: string | null;
}

const EMPTY_VALUES: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  type: "PRODUCT",
  parentId: "",
  isActive: true,
  sortOrder: 0,
  alt: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CategoryForm({
  mode,
  category,
  isSubmitting,
  onSubmit,
  error,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(() => {
    if (!category) return EMPTY_VALUES;
    return {
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      type: category.type,
      parentId: category.parentId ?? "",
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      alt: category.image?.alt ?? "",
    };
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");

  const parentCategoriesQuery = useAdminCategories({
    type: "PRODUCT",
    isActive: true,
    limit: 100,
  });

  const parentCategories = useMemo(() => {
    const categories = parentCategoriesQuery.data?.data ?? [];
    return categories.filter((parent) => parent.id !== category?.id);
  }, [parentCategoriesQuery.data, category?.id]);

  const updateField = <K extends keyof CategoryFormValues>(
    field: K,
    value: CategoryFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleNameChange = (name: string) => {
    setValues((current) => ({
      ...current,
      name,
      slug: slugManuallyEdited ? current.slug : slugify(name),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugManuallyEdited(true);
    updateField("slug", slugify(slug));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...values,
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      parentId: values.parentId || "",
      alt: values.alt.trim(),
    });
  };

  const title = mode === "create" ? "Create category" : "Edit category";
  const description =
    mode === "create"
      ? "Add a new category to the Keplex catalog."
      : "Update the category information and catalog settings.";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-8">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to categories
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main form */}
        <div className="space-y-6">
          {/* Basic information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Category information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Basic information used throughout the catalog.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <Field label="Name" required>
                <input
                  type="text"
                  value={values.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Electronics"
                  required
                  minLength={2}
                  maxLength={100}
                  className={inputClass}
                />
              </Field>

              <Field label="Slug" required hint="Used in category URLs.">
                <input
                  type="text"
                  value={values.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="electronics"
                  required
                  minLength={2}
                  maxLength={100}
                  className={inputClass}
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={values.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe this category..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          {/* Catalog settings */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Catalog settings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure category type, hierarchy and ordering.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Type" required>
                <select
                  value={values.type}
                  onChange={(e) =>
                    updateField(
                      "type",
                      e.target.value as CategoryFormValues["type"],
                    )
                  }
                  className={inputClass}
                >
                  <option value="PRODUCT">Product</option>
                  <option value="SERVICE">Service</option>
                  <option value="CONTENT">Content</option>
                </select>
              </Field>

              <Field label="Parent category" hint="Optional.">
                <select
                  value={values.parentId}
                  onChange={(e) => updateField("parentId", e.target.value)}
                  className={inputClass}
                  disabled={parentCategoriesQuery.isLoading}
                >
                  <option value="">No parent</option>
                  {parentCategories.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Sort order" hint="Lower numbers appear first.">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={values.sortOrder}
                  onChange={(e) =>
                    updateField(
                      "sortOrder",
                      Math.max(0, Number(e.target.value) || 0),
                    )
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                />
                <span>
                  <span className="block text-sm font-medium text-slate-900">
                    Active category
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Active categories can be displayed in the storefront.
                  </span>
                </span>
              </label>
            </div>
          </section>

          {/* Alt text for image (still part of the form) */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Image alt text
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Descriptive text for the category image (accessibility).
              </p>
            </div>
            <div className="mt-6">
              <Field
                label="Alt text"
                hint="Used for accessibility and image fallback."
              >
                <input
                  type="text"
                  value={values.alt}
                  onChange={(e) => updateField("alt", e.target.value)}
                  maxLength={200}
                  placeholder={values.name || "Category image"}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* Sidebar – will be used by parent for the image upload */}
        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Publishing
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              Control whether this category is visible to customers.
            </p>
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>
                <span
                  className={`text-xs font-medium ${
                    values.isActive ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {values.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </section>

          {mode === "edit" && category && (
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Category details
              </h2>
              <dl className="mt-5 space-y-4">
                <Detail
                  label="Products"
                  value={category.productCount.toLocaleString()}
                />
                <Detail
                  label="Children"
                  value={category.childCount.toLocaleString()}
                />
                <Detail
                  label="Created"
                  value={formatDate(category.createdAt)}
                />
                <Detail
                  label="Updated"
                  value={formatDate(category.updatedAt)}
                />
              </dl>
            </section>
          )}
        </aside>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Link
          to="/admin/categories"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create category"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900";
