import { useState } from "react";
import type { AdminVariant } from "../../../../api/product.contract";
import { useArchiveVariant } from "../hooks/useArchiveVariant";
import { useCreateVariant } from "../hooks/useCreateVariant";
import { VariantRow } from "./VariantRow";

interface Props {
  productId: string;
  variants: AdminVariant[];
}

export function VariantList({ productId, variants }: Props) {
  const [adding, setAdding] = useState(false);
  const archiveMutation = useArchiveVariant(productId);
  const createMutation = useCreateVariant(productId);

  const activeVariants = variants.filter((v) => v.isActive);
  const archivedVariants = variants.filter((v) => !v.isActive);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Variants</h2>
          <p className="mt-1 text-sm text-slate-500">
            Each variant saves independently.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Add variant
        </button>
      </div>

      <div className="space-y-4">
        {activeVariants.map((variant) => (
          <VariantRow
            key={variant.id}
            productId={productId}
            variant={variant}
            onArchive={() => {
              if (confirm(`Archive variant ${variant.sku}?`)) {
                archiveMutation.mutate(variant.id);
              }
            }}
          />
        ))}

        {adding && (
          <VariantRow
            productId={productId}
            variant={null}
            onCancel={() => setAdding(false)}
            onSave={async (payload, media) => {
              await createMutation.mutateAsync({ payload, media });
              setAdding(false);
            }}
          />
        )}
      </div>

      {archivedVariants.length > 0 && (
        <div className="mt-8 border-t border-slate-200 pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Archived ({archivedVariants.length})
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            {archivedVariants.map((v) => (
              <li key={v.id} className="flex items-center justify-between">
                <span>{v.sku}</span>
                <button
                  type="button"
                  className="text-xs font-medium text-slate-700 underline"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
