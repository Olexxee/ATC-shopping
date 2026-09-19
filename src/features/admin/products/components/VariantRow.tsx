import { useState } from "react";
import type { AdminVariant } from "../../../../api/product/product.contract";
import type { VariantPayload } from "../../../../api/product/variants.api";
import { useUpdateVariant } from "../hooks/useUpdateVariant";

interface Props {
  productId: string;
  variant: AdminVariant | null;
  onArchive?: () => void;
  onCancel?: () => void;
  onSave?: (payload: VariantPayload, media: File[]) => Promise<void>;
}

export function VariantRow({ productId, variant, onArchive, onCancel, onSave }: Props) {
  const isNew = variant === null;

  const [draft, setDraft] = useState<Partial<VariantPayload>>(
    variant
      ? {
          sku: variant.sku ?? "",
          color: variant.color ?? "",
          size: variant.size ?? "",
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stock: variant.stock,
          weight: variant.weight,
          actualWeight: variant.actualWeight,
          length: variant.length,
          width: variant.width,
          height: variant.height,
          fulfillmentType: variant.fulfillmentType,
          shippingType: variant.shippingType,
          isActive: variant.isActive,
        }
      : { isActive: true, stock: 0, weight: 0, actualWeight: 0 },
  );

  const [media, setMedia] = useState<File[]>([]);
  const updateMutation = useUpdateVariant(productId);

  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const save = async () => {
    setState("saving");
    try {
      if (isNew) {
        await onSave?.(draft as VariantPayload, media);
      } else {
        await updateMutation.mutateAsync({
          variantId: variant!.id,
          payload: draft,
          media,
        });
      }
      setState("saved");
      setMedia([]);
      setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Input
          label="SKU"
          value={draft.sku ?? ""}
          onChange={(v) => setDraft({ ...draft, sku: v })}
        />
        <Input
          label="Color"
          value={draft.color ?? ""}
          onChange={(v) => setDraft({ ...draft, color: v })}
        />
        <Input
          label="Size"
          value={draft.size ?? ""}
          onChange={(v) => setDraft({ ...draft, size: v })}
        />
        <Input
          label="Price"
          type="number"
          value={String(draft.price ?? "")}
          onChange={(v) => setDraft({ ...draft, price: Number(v) })}
        />
        <Input
          label="Stock"
          type="number"
          value={String(draft.stock ?? 0)}
          onChange={(v) => setDraft({ ...draft, stock: Number(v) })}
        />
        <Input
          label="Weight"
          type="number"
          value={String(draft.weight ?? 0)}
          onChange={(v) => setDraft({ ...draft, weight: Number(v) })}
        />
        <Input
          label="Actual weight"
          type="number"
          value={String(draft.actualWeight ?? 0)}
          onChange={(v) => setDraft({ ...draft, actualWeight: Number(v) })}
        />
      </div>

      <div className="mt-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setMedia(Array.from(e.target.files ?? []))}
          className="text-sm"
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-sm">
          {state === "saved" && <span className="text-emerald-600">Saved</span>}
          {state === "error" && <span className="text-red-600">Save failed</span>}
        </div>

        <div className="flex gap-2">
          {isNew && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            >
              Cancel
            </button>
          )}
          {!isNew && onArchive && (
            <button
              type="button"
              onClick={onArchive}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600"
            >
              Archive
            </button>
          )}
          <button
            type="button"
            disabled={state === "saving"}
            onClick={save}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {state === "saving" ? "Saving..." : isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Small local helper — put in its own file if reused
function Input({ label, value, onChange, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}
