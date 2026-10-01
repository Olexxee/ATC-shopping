import { useState } from "react";
import { Plus } from "lucide-react";
import type { AdminVariant } from "../../../../api/product/product.contract";
import type { CreateVariantInput } from "../api/adminVariants.api";
import { useCreateVariant } from "../hooks/useCreateVariant";
import { useArchiveVariant } from "../hooks/useArchiveVariant";
import { VariantRow } from "./VariantRow";

interface Props {
  productId: string;
  variants: AdminVariant[];
}

export function VariantList({ productId, variants }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const createMutation = useCreateVariant(productId);
  const archiveMutation = useArchiveVariant(productId);

  const inactiveCount = variants.filter((v) => !v.isActive).length;

  const handleCreate = async (payload: CreateVariantInput, media: File[]) => {
    await createMutation.mutateAsync({ payload, media });
    setIsAdding(false);
  };

  const handleArchive = async (variantId: string) => {
    if (
      !window.confirm(
        "Archive this variant? If it has order history it is hidden from the storefront and can be restored. Otherwise it is permanently deleted.",
      )
    ) {
      return;
    }

    setArchiveError(null);
    try {
      await archiveMutation.mutateAsync(variantId);
    } catch (err) {
      setArchiveError(
        err instanceof Error ? err.message : "Couldn't archive the variant.",
      );
    }
  };

  const archivingId = archiveMutation.isPending
    ? archiveMutation.variables
    : undefined;

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Variants
            <span className="ml-2 text-sm font-normal text-slate-500">
              {variants.length}
            </span>
            {inactiveCount > 0 && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {inactiveCount} inactive
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Each variant is saved on its own, using the buttons in its card.
          </p>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus size={14} />
            Add variant
          </button>
        )}
      </div>

      {archiveError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {archiveError}
        </div>
      )}

      {variants.length === 0 && !isAdding && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-900">No variants yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Add a variant to set a price and stock for this product.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={14} />
            Add variant
          </button>
        </div>
      )}

      <div className="space-y-3">
        {variants.map((variant) => (
          <VariantRow
            key={variant.id}
            productId={productId}
            variant={variant}
            defaultOpen={variants.length === 1 && !isAdding}
            isArchiving={archivingId === variant.id}
            onArchive={() => handleArchive(variant.id)}
          />
        ))}

        {isAdding && (
          <VariantRow
            productId={productId}
            variant={null}
            onCancel={() => setIsAdding(false)}
            onSave={handleCreate}
          />
        )}
      </div>
    </section>
  );
}
