import { useEffect, useState } from "react";
import type { AdminProductDetail } from "../../../../api/product/product.contract";
import { useUpdateProductScalars } from "../hooks/useUpdateProductScalars";
import { ProductScalars } from "./ProductScalars";
import { VariantList } from "./VariantList";

interface Props {
  product: AdminProductDetail;
  onSaved?: () => void;
}

export function ProductEditor({ product, onSaved }: Props) {
  const [draft, setDraft] = useState(product);
  const updateMutation = useUpdateProductScalars();

  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setDraft(product);
  }, [product.id, product.updatedAt]);

  const updateDraft = <K extends keyof AdminProductDetail>(
    key: K,
    value: AdminProductDetail[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveScalars = async () => {
    setSaveState("saving");
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        id: draft.id,
        payload: {
          name: draft.name,
          slug: draft.slug,
          description: draft.description,
          brandId: draft.brandId,
          categoryId: draft.categoryId,
          collectionId: draft.collectionId,
          isFeatured: draft.isFeatured,
          isNew: draft.isNew,
          isBestSeller: draft.isBestSeller,
          status: draft.status,
          metadata: draft.metadata,
        },
      });

      setSaveState("saved");
      onSaved?.();
      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to save");
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {saveState === "error" && errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {saveState === "saved" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Product saved
        </div>
      )}

      <ProductScalars values={draft} onChange={updateDraft} />

      <VariantList productId={draft.id} variants={draft.variants} />

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:-mx-6 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3">
          <button
            type="button"
            disabled={saveState === "saving"}
            onClick={saveScalars}
            className="inline-flex min-w-40 items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saveState === "saving" ? "Saving..." : "Save product"}
          </button>
        </div>
      </div>
    </div>
  );
}
