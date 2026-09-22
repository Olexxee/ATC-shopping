// features/admin/products/components/VariantList.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import type { AdminVariant } from "../../../../api/product/product.contract";
import type { VariantPayload } from "../../../../api/product/variants.api";
import { useCreateVariant } from "../hooks/useCreateVariant";
import { useArchiveVariant } from "../hooks/useArchiveVariant";
import { VariantRow } from "./VariantRow";

interface Props {
  productId: string;
  variants: AdminVariant[];
}

export function VariantList({ productId, variants }: Props) {
  const [isAdding, setIsAdding] = useState(false);

  const createMutation = useCreateVariant(productId);
  const archiveMutation = useArchiveVariant(productId);

  const handleCreate = async (payload: VariantPayload, media: File[]) => {
    await createMutation.mutateAsync({ payload, media });
    setIsAdding(false);
  };

  const handleArchive = async (variantId: string) => {
    if (!window.confirm("Archive this variant? It can be restored later.")) {
      return;
    }
    await archiveMutation.mutateAsync(variantId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">
          Variants
          <span className="ml-2 text-xs font-normal text-slate-500">
            {variants.length}
          </span>
        </h2>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus size={14} />
            Add variant
          </button>
        )}
      </div>

      {variants.length === 0 && !isAdding && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center">
          <p className="text-sm text-slate-500">No variants yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {variants.map((variant) => (
          <VariantRow
            key={variant.id}
            productId={productId}
            variant={variant}
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
    </div>
  );
}
