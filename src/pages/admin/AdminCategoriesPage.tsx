import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import {
  useAdminCategories,
  useDeleteCategory,
} from "../../features/admin/category/category.queries";
import { CategoryFilters } from "../../features/admin/category/components/CategoryFilters";
import { CategoryTable } from "../../features/admin/category/components/CategoryTable";
import { AdminConfirmDialog } from "../../components/admin/AdminConfirmDialog";
import type {
  AdminCategory,
  CategoryFilters as CategoryFilterState,
} from "../../features/admin/category/category.types";




export function AdminCategoriesPage() {
  const [filters, setFilters] = useState<CategoryFilterState>({
    page: 1,
    limit: 20,
  });
  const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);

    useState<AdminCategory | null>(null);

  const { data, isLoading, isError, error } = useAdminCategories(filters);
  const deleteMutation = useDeleteCategory();

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    await deleteMutation.mutateAsync(categoryToDelete.id);
    setCategoryToDelete(null);

    // If we deleted the last item on the current page, go to previous page
    if (categories.length === 1 && filters.page && filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Catalog
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Categories
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage product categories in the Keplex catalog.
          </p>
        </div>
        <Link
          to="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
          Add category
        </Link>
      </div>

      {/* Filters */}
      <CategoryFilters filters={filters} onChange={setFilters} />

      {/* Main content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">Loading categories...</p>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              Unable to load categories.
            </p>
            <p className="mt-1 text-sm text-red-600">
              {error instanceof Error ? error.message : "Something went wrong."}
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              No categories found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filters.search
                ? "Try adjusting your search or filters."
                : "Create your first category to start organizing products."}
            </p>
            {!filters.search && (
              <Link
                to="/admin/categories/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                <Plus size={16} />
                Create category
              </Link>
            )}
          </div>
        ) : (
          <>
            <CategoryTable
              categories={categories}
              onDelete={setCategoryToDelete}
            />

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!meta.hasPrevPage}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: Math.max(1, (prev.page || 1) - 1),
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={!meta.hasNextPage}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AdminConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Delete category?"
        description={
          categoryToDelete
            ? `This will permanently delete "${categoryToDelete.name}". All child categories will remain but this category will be removed.`
            : ""
        }
        confirmLabel="Delete category"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setCategoryToDelete(null);
          }
        }}
      />

      {/* Error display for delete */}
      {deleteMutation.isError && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Unable to delete category."}
        </div>
      )}
    </div>
  );
}
