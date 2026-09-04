import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateCategory } from "../../features/admin/category/category.queries";
import { CategoryForm } from "../../features/admin/category/components/CategoryForm";
import { CategoryImageUpload } from "../../features/admin/category/components/CategoryImageUpload";
import type { CategoryFormValues } from "../../features/admin/category/category.types";

export function AdminCreateCategoryPage() {
  const navigate = useNavigate();

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createMutation = useCreateCategory();

  // Submit handler – form only gives values, we combine with imageFile
  const handleSubmit = (values: CategoryFormValues) => {
    createMutation.mutate(
      {
        values,
        image: imageFile,
      },
      {
        onSuccess: (response) => {
          navigate(`/admin/categories/${response.data.id}/edit`);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main form */}
        <CategoryForm
          mode="create"
          isSubmitting={createMutation.isPending}
          onSubmit={handleSubmit}
          error={
            createMutation.error instanceof Error
              ? createMutation.error.message
              : null
          }
        />

        {/* Sidebar – image upload */}
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
                previewUrl={null}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
