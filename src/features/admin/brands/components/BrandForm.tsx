import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ImagePlus, X } from "lucide-react";

import type { AdminBrand, BrandFormValues } from "../brand.types";

interface BrandFormProps {
  mode: "create" | "edit";
  initialBrand?: AdminBrand;
  isSubmitting?: boolean;
  onSubmit: (values: BrandFormValues, image: File | null) => void;
  error?: string | null;
}

const EMPTY_VALUES: BrandFormValues = {
  name: "",
  slug: "",
  description: "",
  isActive: true,
  sortOrder: 0,
};

export function BrandForm({
  mode,
  initialBrand,
  isSubmitting = false,
  onSubmit,
  error,
}: BrandFormProps) {
  const [values, setValues] = useState<BrandFormValues>(EMPTY_VALUES);

  const [image, setImage] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!initialBrand) {
      setValues(EMPTY_VALUES);
      setImage(null);
      setPreviewUrl(null);
      setSlugManuallyEdited(false);
      return;
    }

    const existingImage =
      initialBrand.media?.find((media) => media.isPrimary) ??
      initialBrand.media?.[0] ??
      null;

    setValues({
      name: initialBrand.name,
      slug: initialBrand.slug,
      description: initialBrand.description ?? "",
      isActive: initialBrand.isActive,
      sortOrder: initialBrand.sortOrder,
    });

    setImage(null);
    setPreviewUrl(existingImage?.url ?? null);
    setSlugManuallyEdited(true);
  }, [initialBrand]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const updateValue = <K extends keyof BrandFormValues>(
    key: K,
    value: BrandFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleNameChange = (value: string) => {
    updateValue("name", value);

    if (!slugManuallyEdited) {
      updateValue("slug", slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);

    updateValue("slug", slugify(value));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreview = URL.createObjectURL(file);

    setImage(file);
    setPreviewUrl(nextPreview);

    event.target.value = "";
  };

  const removeImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setImage(null);

    if (mode === "edit") {
      const existingImage =
        initialBrand?.media?.find((media) => media.isPrimary) ??
        initialBrand?.media?.[0] ??
        null;

      setPreviewUrl(existingImage?.url ?? null);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(values, image);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/brands"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to brands
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            {mode === "create" ? "Create brand" : "Edit brand"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {mode === "create"
              ? "Add a new brand to the Keplex catalog."
              : "Update this brand's catalog information."}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Basic information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Brand information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information used throughout the catalog.
            </p>

            <div className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="brand-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Name
                </label>

                <input
                  id="brand-name"
                  type="text"
                  value={values.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="e.g. Nike"
                  required
                  minLength={2}
                  maxLength={100}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="brand-slug"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Slug
                </label>

                <input
                  id="brand-slug"
                  type="text"
                  value={values.slug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                  placeholder="nike"
                  required
                  minLength={2}
                  maxLength={100}
                  pattern="[a-z0-9-]+"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="brand-description"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="brand-description"
                  value={values.description}
                  onChange={(event) =>
                    updateValue("description", event.target.value)
                  }
                  rows={5}
                  placeholder="Describe the brand..."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Brand logo
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload a logo for this brand.
              </p>
            </div>

            <div className="mt-6">
              {previewUrl ? (
                <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8">
                  <img
                    src={previewUrl}
                    alt={`${values.name || "Brand"} logo`}
                    className="max-h-40 max-w-[80%] object-contain"
                  />

                  {image && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:text-red-600"
                      title="Remove selected logo"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <label
                  htmlFor="brand-image"
                  className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-slate-400 hover:bg-slate-100"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <ImagePlus size={21} className="text-slate-500" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-700">
                    Upload brand logo
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    JPEG, PNG, WEBP or GIF · Max 5 MB
                  </p>
                </label>
              )}

              <input
                id="brand-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />

              {previewUrl && (
                <label
                  htmlFor="brand-image"
                  className="mt-3 inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  {image ? "Choose another logo" : "Replace logo"}
                </label>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Publishing
            </h2>

            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) =>
                    updateValue("isActive", event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />

                <span>
                  <span className="block text-sm font-medium text-slate-700">
                    Active
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Active brands can be displayed throughout the storefront.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">Display</h2>

            <div className="mt-5">
              <label
                htmlFor="brand-sort-order"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Sort order
              </label>

              <input
                id="brand-sort-order"
                type="number"
                min={0}
                step={1}
                value={values.sortOrder}
                onChange={(event) =>
                  updateValue("sortOrder", Number(event.target.value))
                }
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Lower values appear first.
              </p>
            </div>
          </section>

          {mode === "edit" && initialBrand && (
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Brand details
              </h2>

              <dl className="mt-5 space-y-4">
                <Detail
                  label="Products"
                  value={String(initialBrand.productCount)}
                />

                <Detail label="Brand ID" value={initialBrand.id} />

                <Detail
                  label="Created"
                  value={formatDate(initialBrand.createdAt)}
                />
              </dl>
            </section>
          )}
        </aside>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Link
          to="/admin/brands"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-6 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create brand"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>

      <dd className="mt-1 break-all text-sm text-slate-700">{value}</dd>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
