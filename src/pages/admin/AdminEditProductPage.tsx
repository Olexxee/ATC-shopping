import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import { ProductEditor } from "../../features/admin/products/components/ProductEditor";
import { useAdminProduct } from "../../features/admin/products/hooks/useAdminProduct";

export function AdminEditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminProduct({
    id,
    enabled: !!id,
  });

  if (!id) {
    return (
      <ProductPageError
        title="Product not found"
        message="No product ID was provided."
        onRetry={() => navigate("/admin/products")}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>

        <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 size={28} className="animate-spin text-slate-400" />

            <p className="text-sm font-medium text-slate-700">
              Loading product...
            </p>

            <p className="text-xs text-slate-500">
              Fetching the product details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ProductPageError
        title="Unable to load product"
        message={
          error instanceof Error
            ? error.message
            : "The requested product could not be loaded."
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Catalog
            </p>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {product.status}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Edit product
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the catalog information, variants, images and visibility for{" "}
            <span className="font-medium text-slate-700">{product.name}</span>.
          </p>
        </div>
      </div>

      <ProductEditor product={product} />
    </div>
  );
}

interface ProductPageErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

function ProductPageError({ title, message, onRetry }: ProductPageErrorProps) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>
      </div>

      <div className="flex min-h-96 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
        <div className="max-w-md px-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <TriangleAlert size={22} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>

          <p className="mt-2 text-sm text-slate-600">{message}</p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Try again
            </button>

            <Link
              to="/admin/products"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
