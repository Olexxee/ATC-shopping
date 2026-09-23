import { useState } from "react";
import type { AdminVariant } from "../../../../api/product/product.contract";
import type {
  CreateVariantInput,
  UpdateVariantInput,
} from "../api/adminVariants.api";
import { useUpdateVariant } from "../hooks/useUpdateVariant";

interface Props {
  productId: string;
  variant: AdminVariant | null;
  onArchive?: () => void;
  onCancel?: () => void;
  onSave?: (payload: CreateVariantInput, media: File[]) => Promise<void>;
}

interface Draft {
  sku: string;
  color: string;
  size: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  weight: string;
  actualWeight: string;
  length: string;
  width: string;
  height: string;
  fulfillmentType: string;
  shippingType: string;
  isActive: boolean;
}

const str = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : String(n);

const toDraft = (variant: AdminVariant | null): Draft =>
  variant
    ? {
        sku: variant.sku ?? "",
        color: variant.color ?? "",
        size: variant.size ?? "",
        price: String(variant.price),
        compareAtPrice: str(variant.compareAtPrice),
        stock: String(variant.stock),
        weight: String(variant.weight),
        actualWeight: String(variant.actualWeight),
        length: str(variant.length),
        width: str(variant.width),
        height: str(variant.height),
        fulfillmentType: variant.fulfillmentType,
        shippingType: variant.shippingType,
        isActive: variant.isActive,
      }
    : {
        sku: "",
        color: "",
        size: "",
        price: "",
        compareAtPrice: "",
        stock: "0",
        weight: "",
        actualWeight: "",
        length: "",
        width: "",
        height: "",
        fulfillmentType: "LOCAL",
        shippingType: "LOCAL",
        isActive: true,
      };

const parseRequiredNumber = (s: string, field: string): number => {
  const n = Number(s);
  if (!s.trim() || !Number.isFinite(n)) {
    throw new Error(`${field} must be a valid number`);
  }
  return n;
};

const parseOptionalNumber = (s: string): number | null => {
  if (!s.trim()) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error("Invalid numeric value");
  return n;
};

export function VariantRow({
  productId,
  variant,
  onArchive,
  onCancel,
  onSave,
}: Props) {
  const isNew = variant === null;
  const [draft, setDraft] = useState<Draft>(() => toDraft(variant));
  const [media, setMedia] = useState<File[]>([]);
  const updateMutation = useUpdateVariant(productId);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (): UpdateVariantInput => ({
    sku: draft.sku.trim() || undefined,
    color: draft.color.trim() || undefined,
    size: draft.size.trim() || undefined,
    price: parseRequiredNumber(draft.price, "Price"),
    compareAtPrice: parseOptionalNumber(draft.compareAtPrice),
    stock: Number.parseInt(draft.stock || "0", 10),
    weight: parseRequiredNumber(draft.weight, "Weight"),
    actualWeight: parseRequiredNumber(draft.actualWeight, "Actual weight"),
    length: parseOptionalNumber(draft.length),
    width: parseOptionalNumber(draft.width),
    height: parseOptionalNumber(draft.height),
    fulfillmentType: draft.fulfillmentType,
    shippingType: draft.shippingType,
    isActive: draft.isActive,
  });

  const save = async () => {
    setState("saving");
    setError(null);
    try {
      const payload = buildPayload();
      if (isNew) {
        await onSave?.(payload as CreateVariantInput, media);
      } else {
        await updateMutation.mutateAsync({
          variantId: variant!.id,
          payload,
          media,
        });
      }
      setState("saved");
      setMedia([]);
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Input label="SKU" value={draft.sku} onChange={(v) => set("sku", v)} />
        <Input
          label="Color"
          value={draft.color}
          onChange={(v) => set("color", v)}
        />
        <Input
          label="Size"
          value={draft.size}
          onChange={(v) => set("size", v)}
        />
        <Input
          label="Price"
          type="number"
          value={draft.price}
          onChange={(v) => set("price", v)}
        />
        <Input
          label="Compare at price"
          type="number"
          value={draft.compareAtPrice}
          onChange={(v) => set("compareAtPrice", v)}
        />
        <Input
          label="Stock"
          type="number"
          value={draft.stock}
          onChange={(v) => set("stock", v)}
        />
        <Input
          label="Weight"
          type="number"
          value={draft.weight}
          onChange={(v) => set("weight", v)}
        />
        <Input
          label="Actual weight"
          type="number"
          value={draft.actualWeight}
          onChange={(v) => set("actualWeight", v)}
        />
        <Input
          label="Length"
          type="number"
          value={draft.length}
          onChange={(v) => set("length", v)}
        />
        <Input
          label="Width"
          type="number"
          value={draft.width}
          onChange={(v) => set("width", v)}
        />
        <Input
          label="Height"
          type="number"
          value={draft.height}
          onChange={(v) => set("height", v)}
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
          {state === "error" && (
            <span className="text-red-600">{error ?? "Save failed"}</span>
          )}
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

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
    </label>
  );
}
