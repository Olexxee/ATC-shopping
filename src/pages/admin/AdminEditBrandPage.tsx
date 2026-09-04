import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAdminBrand,
  useUpdateBrand,
} from "../../features/admin/brands/brand.queries";
import { BrandForm } from "../../features/admin/brands/components/BrandForm";
import type { BrandFormValues } from "../../features/admin/brands/brand.types";


export function AdminEditBrandPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const brandQuery = useAdminBrand(id);

  const updateMutation = useUpdateBrand();

  const handleSubmit = (values: BrandFormValues, image: File | null) => {
    updateMutation.mutate(
      {
        id,
        values,
        image,
      },
      {
        onSuccess: () => {
          navigate("/admin/brands");
        },
      },
    );
  };

  if (brandQuery.isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <BrandFormSkeleton />
      </div>
    );
  }

  if (brandQuery.isError || !brandQuery.data?.data) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <h1 className="text-lg font-semibold text-slate-900">
            Brand not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The brand you're looking for could not be loaded.
          </p>

          <Link
            to="/admin/brands"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <BrandForm
        mode="edit"
        initialBrand={brandQuery.data.data}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
        error={
          updateMutation.error instanceof Error
            ? updateMutation.error.message
            : null
        }
      />
    </div>
  );
}

function BrandFormSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

        <div className="mt-5 h-8 w-48 animate-pulse rounded bg-slate-100" />

        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="h-[430px] animate-pulse rounded-xl bg-slate-100" />
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
