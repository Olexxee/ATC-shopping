import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useAdminCategories,
  useUpdateCategory,
} from "../../features/admin/category/category.queries";
import { CategoryForm } from "../../features/admin/category/components/CategoryForm";
import { CategoryImageUpload } from "../../features/admin/category/components/CategoryImageUpload";
import type { CategoryFormValues } from "../../features/admin/category/category.types";

export function AdminEditCategoryPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const categoryQuery = useAdminCategories({ page: 1, limit: 1, search: id });
  const updateMutation = useUpdateCategory();

  // 👇 Extract the first category from the array
  const category = categoryQuery.data?.data?.[0];

  if (categoryQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-5 h-8 w-56 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </div>
          <div>
            <SkeletonSection />
          </div>
        </div>
      </div>
    );
  }

  if (categoryQuery.isError || !category) {
    return (
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to categories
        </Link>
        <div className="py-20 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Category not found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            The category you're trying to edit does not exist.
          </p>
          <Link
            to="/admin/categories"
            className="mt-6 inline-block text-sm font-medium underline"
          >
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (values: CategoryFormValues) => {
    updateMutation.mutate(
      {
        id: category.id,
        values,
        image: imageFile,
      },
      {
        onSuccess: () => {
          navigate("/admin/categories");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CategoryForm
          mode="edit"
          category={category}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
          error={
            updateMutation.error instanceof Error
              ? updateMutation.error.message
              : null
          }
        />

        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Category image
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a primary image for this category.
            </p>
            <div className="mt-6">
              <CategoryImageUpload
                value={imageFile}
                onChange={setImageFile}
                previewUrl={category.image?.url ?? null}
                alt={category.image?.alt ?? category.name}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mt-6 space-y-5">
        <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}
