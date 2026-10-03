import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useCreateProduct } from "../../features/admin/products/hooks/useCreateProduct";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../../features/admin/products/hooks/useProductOptions";
import type {
  ProductFulfillmentType,
  ProductShippingType,
} from "../../features/admin/products/api/adminProducts.api";

import { useAdminSourcingRequest } from "../../features/admin/sourcing/admin-sourcing.queries";
import { useCreateAdminSourcingResponse } from "../../features/admin/sourcing/admin-sourcing.mutations";

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

interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId: string;
  collectionId: string;
  status: "DRAFT";
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

const createEmptyForm = (): ProductFormState => ({
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  brandId: "",
  collectionId: "",
  status: "DRAFT",
});

const toNumber = (value: string, field: string): number => {
  const parsed = Number(value);

  if (!value.trim() || !Number.isFinite(parsed)) {
    throw new Error(`${field} must be a valid number`);
  }

  return parsed;
};

const toOptionalNumber = (value: string): number | null => {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid numeric value");
  }

  return parsed;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function AdminCreateProductPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sourcingId = searchParams.get("sourcingId") ?? undefined;

  const createMutation = useCreateProduct();

  const createSourcingResponseMutation =
    useCreateAdminSourcingResponse();

  const { data: brands = [] } = useProductBrands();
  const { data: categories = [] } = useProductCategories();
  const { data: collections = [] } = useProductCollections();

  const sourcingQuery = useAdminSourcingRequest(sourcingId, {
    enabled: Boolean(sourcingId),
  });

  const [form, setForm] = useState<ProductFormState>(
    createEmptyForm(),
  );

  const [variants, setVariants] = useState<VariantFormState[]>([
    createEmptyVariant(),
  ]);

  const [error, setError] = useState("");

  const isSourcingProduct = Boolean(sourcingId);

  /*
   * ------------------------------------------------------------
   * Sourcing AI prefill
   * ------------------------------------------------------------
   *
   * AI gives us descriptive information, not database IDs.
   *
   * Therefore:
   * - category name -> match against loaded categories
   * - brand name -> match against loaded brands
   * - title/description -> use as product basics
   *
   * Price, stock, weight, dimensions, etc. remain admin-controlled.
   */
  useEffect(() => {
    const request = sourcingQuery.data;

    if (!request) {
      return;
    }

    const analysis = request.aiAnalysis;

    const matchedCategory = analysis?.category
      ? categories.find(
          (category) =>
            normalize(category.name) ===
            normalize(analysis.category!),
        )
      : undefined;

    const matchedBrand = analysis?.brand
      ? brands.find(
          (brand) =>
            normalize(brand.name) ===
            normalize(analysis.brand!),
        )
      : undefined;

    setForm((current) => ({
      ...current,

      name:
        current.name ||
        request.title ||
        analysis?.productType ||
        "",

      description:
        current.description ||
        request.description ||
        "",

      categoryId:
        current.categoryId ||
        matchedCategory?.id ||
        "",

      brandId:
        current.brandId ||
        matchedBrand?.id ||
        "",
    }));
  }, [sourcingQuery.data, categories, brands]);

  /*
   * ------------------------------------------------------------
   * Variant helpers
   * ------------------------------------------------------------
   */

  const updateVariant = (
    index: number,
    patch: Partial<VariantFormState>,
  ) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? { ...variant, ...patch }
          : variant,
      ),
    );
  };

  const addVariant = () => {
    setVariants((current) => [
      ...current,
      createEmptyVariant(),
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((current) =>
      current.filter((_, variantIndex) => variantIndex !== index),
    );
  };

  /*
   * ------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------
   */

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Category is required.");
      return;
    }

    if (variants.length === 0) {
      setError("At least one variant is required.");
      return;
    }

    try {
      /*
       * Flatten all variant images into one file array.
       *
       * imageIndexes allow the backend to associate uploaded
       * images with their original variants.
       */
      const allImages: File[] = [];

      const variantInputs = variants.map((variant) => {
        const startIndex = allImages.length;

        allImages.push(...variant.images);

        const imageIndexes = variant.images.map(
          (_, imageIndex) => startIndex + imageIndex,
        );

        return {
          sku: variant.sku.trim() || undefined,
          color: variant.color.trim() || undefined,
          size: variant.size.trim() || undefined,

          price: toNumber(variant.price, "Price"),

          compareAtPrice: toOptionalNumber(
            variant.compareAtPrice,
          ),

          stock: Number.parseInt(
            variant.stock || "0",
            10,
          ),

          weight: toNumber(
            variant.weight,
            "Weight",
          ),

          actualWeight: toNumber(
            variant.actualWeight,
            "Actual weight",
          ),

          length: toOptionalNumber(variant.length),
          width: toOptionalNumber(variant.width),
          height: toOptionalNumber(variant.height),

          fulfillmentType: variant.fulfillmentType,
          shippingType: variant.shippingType,

          isActive: true,

          imageIndexes,
        };
      });

      /*
       * ----------------------------------------------------------
       * 1. Create the normal Keplex product
       * ----------------------------------------------------------
       */
      const product = await createMutation.mutateAsync({
        product: {
          name: form.name.trim(),

          slug: form.slug
            .trim()
            .toLowerCase(),

          description:
            form.description.trim() || null,

          categoryId: form.categoryId,

          brandId:
            form.brandId || null,

          collectionId:
            form.collectionId || null,

          status: form.status,

          variants: variantInputs,
        },

        images: allImages,
      });

      /*
       * ----------------------------------------------------------
       * 2. If this product came from sourcing, attach it to
       *    the sourcing request.
       * ----------------------------------------------------------
       */
      if (sourcingId) {
        const firstVariant = product.variants?.[0];

        if (!firstVariant) {
          throw new Error(
            "Product was created, but no variant was returned.",
          );
        }

        await createSourcingResponseMutation.mutateAsync({
          requestId: sourcingId,

          input: {
            productId: product.id,
            variantId: firstVariant.id,

            message:
              "The sourced product has been added to the Keplex catalog.",
          },
        });
      }

      /*
       * ----------------------------------------------------------
       * 3. Product creation is complete.
       *
       *    Whether this came from sourcing or not, the product
       *    now follows the normal admin product flow.
       * ----------------------------------------------------------
       */
      navigate(
        `/admin/products/${product.id}/edit`,
        {
          replace: true,
        },
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create product",
      );
    }
  };

  /*
   * ------------------------------------------------------------
   * Sourcing loading state
   * ------------------------------------------------------------
   *
   * Only relevant when sourcingId exists.
   */
  if (
    isSourcingProduct &&
    sourcingQuery.isLoading
  ) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <Link
            to="/admin/sourcing"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to sourcing
          </Link>
        </div>

        <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2
              size={28}
              className="animate-spin text-slate-400"
            />

            <p className="text-sm font-medium text-slate-700">
              Loading sourcing request...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * Sourcing request error
   * ------------------------------------------------------------
   */
  if (
    isSourcingProduct &&
    sourcingQuery.isError
  ) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8">
          <Link
            to="/admin/sourcing"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to sourcing
          </Link>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Unable to load sourcing request
          </h1>

          <p className="mt-2 text-sm text-red-700">
            The sourcing request could not be loaded.
            The product form cannot be safely prefilled.
          </p>
        </div>
      </div>
    );
  }

  const sourcingRequest = sourcingQuery.data;

  return (
    <div className="mx-auto max-w-3xl">
      {/* --------------------------------------------------------
          Header
      --------------------------------------------------------- */}

      <div className="mb-8">
        <Link
          to={
            isSourcingProduct
              ? `/admin/sourcing/${sourcingId}`
              : "/admin/products"
          }
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />

          {isSourcingProduct
            ? "Back to sourcing request"
            : "Back to products"}
        </Link>

        <div className="mt-5 flex items-center gap-3">
          {isSourcingProduct && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Sparkles size={17} />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {isSourcingProduct
                ? "Create sourced product"
                : "Create product"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {isSourcingProduct
                ? "Review the AI-assisted information, complete the product details, and add the sourced product to the catalog."
                : "Add the product basics and at least one variant."}
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------
          Sourcing context
      --------------------------------------------------------- */}

      {isSourcingProduct && sourcingRequest && (
        <div className="mb-6 rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles
              size={18}
              className="mt-0.5 shrink-0 text-violet-600"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-violet-950">
                AI-assisted sourcing
              </p>

              <p className="mt-1 text-sm leading-6 text-violet-800">
                Request{" "}
                <span className="font-medium">
                  {sourcingRequest.requestNumber}
                </span>{" "}
                has been used to prefill this product.
                Verify the information before creating it.
              </p>

              {sourcingRequest.aiAnalysis && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sourcingRequest.aiAnalysis.productType && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                      {sourcingRequest.aiAnalysis.productType}
                    </span>
                  )}

                  {sourcingRequest.aiAnalysis.brand && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                      {sourcingRequest.aiAnalysis.brand}
                    </span>
                  )}

                  {sourcingRequest.aiAnalysis.category && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                      {sourcingRequest.aiAnalysis.category}
                    </span>
                  )}

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                    Confidence{" "}
                    {Math.round(
                      sourcingRequest.aiAnalysis.confidence * 100,
                    )}
                    %
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          Error
      --------------------------------------------------------- */}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* --------------------------------------------------------
          Form
      --------------------------------------------------------- */}

      <form
        onSubmit={submit}
        className="space-y-6"
      >
        {/* Product basics */}

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Product information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Basic information used throughout the catalog.
            </p>
          </div>

          <Field
            label="Name"
            value={form.name}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                name: value,
              }))
            }
            required
          />

          <Field
            label="Slug"
            value={form.slug}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                slug: value.toLowerCase(),
              }))
            }
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={5}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Select
              label="Category"
              value={form.categoryId}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  categoryId: value,
                }))
              }
              options={categories}
              placeholder="Select category"
              required
            />

            <Select
              label="Brand"
              value={form.brandId}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  brandId: value,
                }))
              }
              options={brands}
              placeholder="No brand"
            />

            <Select
              label="Collection"
              value={form.collectionId}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  collectionId: value,
                }))
              }
              options={collections}
              placeholder="No collection"
            />
          </div>
        </div>

        {/* Variants */}

        <div className="space-y-5">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Variant {index + 1}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Pricing, stock, shipping, and physical attributes.
                  </p>
                </div>

                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="inline-flex items-center gap-1 text-sm text-red-600 transition hover:text-red-700"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="SKU"
                  value={variant.sku}
                  onChange={(value) =>
                    updateVariant(index, {
                      sku: value,
                    })
                  }
                />

                <Field
                  label="Color"
                  value={variant.color}
                  onChange={(value) =>
                    updateVariant(index, {
                      color: value,
                    })
                  }
                />

                <Field
                  label="Size"
                  value={variant.size}
                  onChange={(value) =>
                    updateVariant(index, {
                      size: value,
                    })
                  }
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="Price"
                  value={variant.price}
                  onChange={(value) =>
                    updateVariant(index, {
                      price: value,
                    })
                  }
                  type="number"
                  required
                />

                <Field
                  label="Compare-at price"
                  value={variant.compareAtPrice}
                  onChange={(value) =>
                    updateVariant(index, {
                      compareAtPrice: value,
                    })
                  }
                  type="number"
                />

                <Field
                  label="Stock"
                  value={variant.stock}
                  onChange={(value) =>
                    updateVariant(index, {
                      stock: value,
                    })
                  }
                  type="number"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="Weight (kg)"
                  value={variant.weight}
                  onChange={(value) =>
                    updateVariant(index, {
                      weight: value,
                    })
                  }
                  type="number"
                  required
                />

                <Field
                  label="Actual weight (kg)"
                  value={variant.actualWeight}
                  onChange={(value) =>
                    updateVariant(index, {
                      actualWeight: value,
                    })
                  }
                  type="number"
                  required
                />

                <Select
                  label="Fulfillment"
                  value={variant.fulfillmentType}
                  onChange={(value) =>
                    updateVariant(index, {
                      fulfillmentType:
                        value as ProductFulfillmentType,
                    })
                  }
                  options={[
                    {
                      id: "LOCAL",
                      name: "Local",
                    },
                    {
                      id: "IMPORT",
                      name: "Import",
                    },
                    {
                      id: "PREORDER",
                      name: "Preorder",
                    },
                    {
                      id: "DIGITAL",
                      name: "Digital",
                    },
                  ]}
                  placeholder="Select"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-4">
                <Field
                  label="Length (cm)"
                  value={variant.length}
                  onChange={(value) =>
                    updateVariant(index, {
                      length: value,
                    })
                  }
                  type="number"
                />

                <Field
                  label="Width (cm)"
                  value={variant.width}
                  onChange={(value) =>
                    updateVariant(index, {
                      width: value,
                    })
                  }
                  type="number"
                />

                <Field
                  label="Height (cm)"
                  value={variant.height}
                  onChange={(value) =>
                    updateVariant(index, {
                      height: value,
                    })
                  }
                  type="number"
                />

                <Select
                  label="Shipping"
                  value={variant.shippingType}
                  onChange={(value) =>
                    updateVariant(index, {
                      shippingType:
                        value as ProductShippingType,
                    })
                  }
                  options={[
                    {
                      id: "LOCAL",
                      name: "Local",
                    },
                    {
                      id: "IMPORT",
                      name: "Import",
                    },
                    {
                      id: "SEA",
                      name: "Sea",
                    },
                    {
                      id: "AIR",
                      name: "Air",
                    },
                    {
                      id: "DIGITAL",
                      name: "Digital",
                    },
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
                  onChange={(event) =>
                    updateVariant(index, {
                      images: Array.from(
                        event.target.files ?? [],
                      ),
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
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            <Plus size={16} />
            Add another variant
          </button>
        </div>

        {/* Submit */}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={
              createMutation.isPending ||
              createSourcingResponseMutation.isPending
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {(createMutation.isPending ||
              createSourcingResponseMutation.isPending) && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {isSourcingProduct
              ? "Create sourced product"
              : "Create product"}
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
  onChange: (value: string) => void;
  type?: "text" | "number";
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </label>

      <input
        type={type}
        step={
          type === "number"
            ? "any"
            : undefined
        }
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    id: string;
    name: string;
  }>;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="text-red-500">
            {" "}
            *
          </span>
        )}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}