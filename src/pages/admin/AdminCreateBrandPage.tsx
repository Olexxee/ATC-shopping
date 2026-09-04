import { useNavigate } from "react-router-dom";
import { useCreateBrand } from "../../features/admin/brands/brand.queries";
import { BrandForm } from "../../features/admin/brands/components/BrandForm";
import type { BrandFormValues } from "../../features/admin/brands/brand.types";


export function AdminCreateBrandPage() {
  const navigate = useNavigate();

  const createMutation = useCreateBrand();

  const handleSubmit = (values: BrandFormValues, image: File | null) => {
    createMutation.mutate(
      {
        values,
        image,
      },
      {
        onSuccess: (response) => {
          navigate(`/admin/brands/${response.data.id}/edit`);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-6xl">
      <BrandForm
        mode="create"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        error={
          createMutation.error instanceof Error
            ? createMutation.error.message
            : null
        }
      />
    </div>
  );
}
