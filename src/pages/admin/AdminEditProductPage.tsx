import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import { ProductEditor } from "../../features/admin/products/components/ProductEditor";
import { useAdminProduct } from "../../features/admin/products/hooks/useAdminProduct";

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  ACTIVE: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  DRAFT: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  ARCHIVED: {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.ARCHIVED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function BackLink() {
  return (
    <Link
      to="/admin/products"
      className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
    >
      <ArrowLeft size={16} />
      Back to products
    </Link>
  );
}

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
          <BackLink />
        </div>

        <div className="flex min-h-96 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 size={28} className="animate-spin text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              Loading product...
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

  const updatedAt = product.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <BackLink />

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="min-w-0 truncate text-2xl font-semibold text-slate-900">
            {product.name}
          </h1>
          <StatusBadge status={product.status} />
        </div>

        {updatedAt && (
          <p className="mt-1.5 text-sm text-slate-500">Updated {updatedAt}</p>
        )}
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
        <BackLink />
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
