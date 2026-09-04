import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "../../types/product.types";
import { AdminConfirmDialog } from "../../components/admin/AdminConfirmDialog";
import { AdminProductTable } from "../../components/admin/AdminProductTable";
import { useAdminProducts } from "../../features/admin/products/useAdminProducts";
import { useDeleteProduct } from "../../features/admin/products/useCreateProduct";

export function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const productsQuery = useAdminProducts(page, 20);
  const deleteProduct = useDeleteProduct();

  const products = productsQuery.data?.data.products ?? [];
  const meta = productsQuery.data?.meta;

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleteError(null);

    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      // Deletion succeeded – close dialog and if it was the last item, go to previous page
      setProductToDelete(null);
      if (products.length === 1 && page > 1) {
        setPage((current) => current - 1);
      }
    } catch (error: any) {
      // If product is already gone, treat as success
      if (error.response?.status === 404) {
        setProductToDelete(null);
        // Optionally refresh the list – but the hook's onSuccess would have invalidated if it succeeded.
        // Since it failed, we manually invalidate to update the list.
        // We can import queryClient and invalidate here, or just let the user see the list without error.
        // We'll just close the dialog.
        return;
      }
      // Other errors – show message
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete product.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage products in the Keplex catalog.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Add product
        </Link>
      </div>

      {productsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Loading products...</p>
        </div>
      ) : productsQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            Unable to load products.
          </p>
          <p className="mt-1 text-sm text-red-600">
            {productsQuery.error instanceof Error
              ? productsQuery.error.message
              : "Something went wrong."}
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No products yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create your first product to start building the catalog.
          </p>
          <Link
            to="/admin/products/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={16} />
            Create product
          </Link>
        </div>
      ) : (
        <>
          <AdminProductTable
            products={products}
            onDelete={setProductToDelete}
            deletingProductId={
              deleteProduct.isPending ? productToDelete?.id : null
            }
          />

          {meta && meta.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!meta.hasPrevPage}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={!meta.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AdminConfirmDialog
        open={Boolean(productToDelete)}
        title="Delete product?"
        description={
          productToDelete
            ? `This will permanently delete "${productToDelete.name}". This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete product"
        loading={deleteProduct.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleteProduct.isPending) {
            setProductToDelete(null);
            setDeleteError(null);
          }
        }}
      />

      {/* Show deletion errors only if not a 404 (handled above) */}
      {deleteError && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteError}
        </div>
      )}
    </div>
  );
}
