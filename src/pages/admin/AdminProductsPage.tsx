// src/pages/admin/AdminProductsPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Archive, Loader2, Plus, TriangleAlert } from "lucide-react";
import { useAdminProducts } from "../../features/admin/products/hooks/useAdminProducts";
import { useArchiveProduct } from "../../features/admin/products/hooks/useArchiveProduct";

export function AdminProductsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminProducts({ page, limit: 20 });

  const archiveMutation = useArchiveProduct();

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage everything in the Keplex catalog.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          New product
        </Link>
      </header>

      {isLoading && (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="animate-spin text-slate-400" size={24} />
        </div>
      )}

      {isError && (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50">
          <TriangleAlert className="text-red-600" />
          <p className="text-sm text-red-700">
            {error instanceof Error ? error.message : "Failed to load"}
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">
            No products yet. Create your first product to get started.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.category ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {product.variantCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={archiveMutation.isPending}
                        onClick={() => {
                          if (confirm(`Archive "${product.name}"?`)) {
                            archiveMutation.mutate({ id: product.id });
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Archive size={14} />
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} total
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
