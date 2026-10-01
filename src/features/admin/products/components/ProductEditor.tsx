import { useEffect, useRef, useState } from "react";
import type { AdminProductDetail } from "../../../../api/product/product.contract";
import { useUpdateProductScalars } from "../hooks/useUpdateProductScalars";
import {
  ProductDetailsSection,
  ProductOrganizationSection,
  ProductStatusSection,
} from "./ProductScalars";
import { VariantList } from "./VariantList";

interface Props {
  product: AdminProductDetail;
  onSaved?: () => void;
}

const toPayload = (d: AdminProductDetail) => ({
  name: d.name,
  slug: d.slug,
  description: d.description,
  brandId: d.brandId,
  categoryId: d.categoryId,
  collectionId: d.collectionId,
  isFeatured: d.isFeatured,
  isNew: d.isNew,
  isBestSeller: d.isBestSeller,
  status: d.status,
  metadata: d.metadata,
});

// null and "" are the same thing for a description; don't call that a change.
const snapshot = (d: AdminProductDetail) =>
  JSON.stringify({ ...toPayload(d), description: d.description ?? "" });

type SaveState = "idle" | "saving" | "saved" | "error";

export function ProductEditor({ product, onSaved }: Props) {
  const [draft, setDraft] = useState(product);
  const updateMutation = useUpdateProductScalars();

  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDraft(product);
  }, [product.id, product.updatedAt]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const isDirty = snapshot(draft) !== snapshot(product);

  // Warn before closing the tab with unsaved product details.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateDraft = <K extends keyof AdminProductDetail>(
    key: K,
    value: AdminProductDetail[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (saveState === "saved" || saveState === "error") setSaveState("idle");
  };

  const discard = () => {
    setDraft(product);
    setSaveState("idle");
    setErrorMessage(null);
  };

  const saveScalars = async () => {
    setSaveState("saving");
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        id: draft.id,
        payload: toPayload(draft),
      });

      setSaveState("saved");
      onSaved?.();
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      setSaveState("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to save");
    }
  };

  const saving = saveState === "saving";

  let statusMessage: { text: string; className: string };
  if (saving) {
    statusMessage = { text: "Saving...", className: "text-slate-500" };
  } else if (saveState === "error" && errorMessage) {
    statusMessage = { text: errorMessage, className: "text-red-600" };
  } else if (saveState === "saved") {
    statusMessage = { text: "Product saved", className: "text-emerald-600" };
  } else if (isDirty) {
    statusMessage = {
      text: "You have unsaved changes to the product details.",
      className: "text-amber-600",
    };
  } else {
    statusMessage = {
      text: "Variants are saved separately, in their own cards.",
      className: "text-slate-500",
    };
  }

  return (
    <div className="pb-28">
      {/* DOM order is the mobile order: details, sidebar, variants.
          On large screens the sidebar sits to the right and spans both rows. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <ProductDetailsSection values={draft} onChange={updateDraft} />
        </div>

        <aside className="space-y-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
          <ProductStatusSection values={draft} onChange={updateDraft} />
          <ProductOrganizationSection values={draft} onChange={updateDraft} />
        </aside>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          {/* Read variants from `product`, not `draft`. Refetches after any
              variant mutation land here without waiting for the draft reset. */}
          <VariantList productId={product.id} variants={product.variants} />
        </div>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-slate-200 bg-white/95 px-4 py-3.5 backdrop-blur md:-mx-6 md:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p
            role="status"
            aria-live="polite"
            className={`min-w-0 text-sm ${statusMessage.className}`}
          >
            {statusMessage.text}
          </p>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={discard}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Discard
            </button>
            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={saveScalars}
              className="inline-flex min-w-36 items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
