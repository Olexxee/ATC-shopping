import { useState } from "react";
import { ChevronDown, Image as ImageIcon } from "lucide-react";
import type { AdminVariant } from "../../../../api/product/product.contract";
import type {
  CreateVariantInput,
  UpdateVariantInput,
} from "../api/adminVariants.api";
import { useUpdateVariant } from "../hooks/useUpdateVariant";
import { ImagePicker } from "./ImagePicker";

interface Props {
  productId: string;
  variant: AdminVariant | null;
  /** Start expanded. Existing variants are collapsed unless this is set. */
  defaultOpen?: boolean;
  isArchiving?: boolean;
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

const FULFILLMENT_OPTIONS = [
  { value: "LOCAL", label: "Local" },
  { value: "IMPORT", label: "Import" },
  { value: "PREORDER", label: "Preorder" },
  { value: "DIGITAL", label: "Digital" },
];

const SHIPPING_OPTIONS = [
  { value: "LOCAL", label: "Local" },
  { value: "IMPORT", label: "Import" },
  { value: "SEA", label: "Sea" },
  { value: "AIR", label: "Air" },
  { value: "DIGITAL", label: "Digital" },
];

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

const formatPrice = (value: unknown) =>
  Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });

export function VariantRow({
  productId,
  variant,
  defaultOpen = false,
  isArchiving = false,
  onArchive,
  onCancel,
  onSave,
}: Props) {
  const isNew = variant === null;
  const [open, setOpen] = useState(isNew || defaultOpen);
  const [draft, setDraft] = useState<Draft>(() => toDraft(variant));
  // The last values known to be saved. Used only to detect unsaved edits.
  const [baseline, setBaseline] = useState<Draft>(() => toDraft(variant));
  const [media, setMedia] = useState<File[]>([]);
  const updateMutation = useUpdateVariant(productId);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const existingMedia = variant?.media ?? [];
  const coverUrl =
    existingMedia.find((m) => m.isPrimary)?.url ??
    existingMedia[0]?.url ??
    null;

  const isDirty =
    !isNew &&
    (media.length > 0 || JSON.stringify(draft) !== JSON.stringify(baseline));

  const title = isNew
    ? "New variant"
    : [draft.color, draft.size].filter(Boolean).join(" / ") ||
      draft.sku ||
      "Variant";

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
    const submitted = draft;
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
        setBaseline(submitted);
      }
      setState("saved");
      setMedia([]);
      setTimeout(() => setState("idle"), 1500);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const busy = state === "saving";
  const inactive = !isNew && !draft.isActive;

  const stock = variant ? Number(variant.stock) : 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white ${
        inactive ? "border-amber-200" : "border-slate-200"
      }`}
    >
      {/* ---------- Header / summary ---------- */}
      {isNew ? (
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">New variant</h3>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex w-full items-center gap-4 px-4 py-3.5 text-left transition hover:bg-slate-50 ${
            inactive ? "bg-amber-50/40" : ""
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-slate-400">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="truncate text-sm font-semibold text-slate-900">
                {title}
              </span>
              {inactive && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Inactive
                </span>
              )}
              {isDirty && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Unsaved
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {variant?.sku || "No SKU"}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-medium text-slate-900">
              {formatPrice(variant?.price)}
            </p>
            <p
              className={`text-xs ${
                stock === 0 ? "text-red-600" : "text-slate-500"
              }`}
            >
              {stock === 0 ? "Out of stock" : `${stock} in stock`}
            </p>
          </div>

          <ChevronDown
            size={18}
            className={`shrink-0 text-slate-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* ---------- Editor ---------- */}
      {open && (
        <div className={isNew ? "p-5" : "border-t border-slate-100 p-5"}>
          {!isNew && (
            <label className="mb-5 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              Active on the storefront
            </label>
          )}

          <div className="space-y-5">
            <Group title="Identity">
              <Input
                label="SKU"
                value={draft.sku}
                onChange={(v) => set("sku", v)}
              />
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
            </Group>

            <Group title="Pricing and stock">
              <Input
                label="Price"
                type="number"
                required
                value={draft.price}
                onChange={(v) => set("price", v)}
              />
              <Input
                label="Compare-at price"
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
            </Group>

            <Group title="Shipping" columns="md:grid-cols-4">
              <Input
                label="Weight (kg)"
                type="number"
                required
                value={draft.weight}
                onChange={(v) => set("weight", v)}
              />
              <Input
                label="Actual weight (kg)"
                type="number"
                required
                value={draft.actualWeight}
                onChange={(v) => set("actualWeight", v)}
              />
              <SelectInput
                label="Fulfillment"
                value={draft.fulfillmentType}
                options={FULFILLMENT_OPTIONS}
                onChange={(v) => set("fulfillmentType", v)}
              />
              <SelectInput
                label="Shipping method"
                value={draft.shippingType}
                options={SHIPPING_OPTIONS}
                onChange={(v) => set("shippingType", v)}
              />
              <Input
                label="Length (cm)"
                type="number"
                value={draft.length}
                onChange={(v) => set("length", v)}
              />
              <Input
                label="Width (cm)"
                type="number"
                value={draft.width}
                onChange={(v) => set("width", v)}
              />
              <Input
                label="Height (cm)"
                type="number"
                value={draft.height}
                onChange={(v) => set("height", v)}
              />
            </Group>

            <div className="space-y-4">
              {existingMedia.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Current images
                  </p>
                  <ul className="flex flex-wrap gap-3">
                    {existingMedia.map((m) => (
                      <li
                        key={m.id}
                        className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={m.url}
                          alt={m.alt ?? ""}
                          className="h-full w-full object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ImagePicker
                label={existingMedia.length > 0 ? "Replace images" : "Images"}
                files={media}
                onChange={setMedia}
                disabled={busy}
              />

              {existingMedia.length > 0 && (
                <p
                  className={`text-xs ${
                    media.length > 0 ? "text-amber-600" : "text-slate-500"
                  }`}
                >
                  {media.length > 0
                    ? `Saving will replace the ${existingMedia.length} current ${
                        existingMedia.length === 1 ? "image" : "images"
                      } with the ${media.length} you selected.`
                    : "Uploading new images replaces all current images for this variant."}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="min-h-5 text-sm" aria-live="polite">
              {state === "saved" && (
                <span className="text-emerald-600">Saved</span>
              )}
              {state === "error" && (
                <span className="text-red-600">{error ?? "Save failed"}</span>
              )}
            </div>

            <div className="flex gap-2">
              {isNew && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
              {!isNew && onArchive && (
                <button
                  type="button"
                  disabled={isArchiving || busy}
                  onClick={onArchive}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {isArchiving ? "Archiving..." : "Archive"}
                </button>
              )}
              <button
                type="button"
                disabled={busy || (!isNew && !isDirty)}
                onClick={save}
                className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {busy ? "Saving..." : isNew ? "Create variant" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({
  title,
  columns = "md:grid-cols-3",
  children,
}: {
  title: string;
  columns?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-slate-500">
        {title}
      </legend>
      <div className={`grid gap-4 sm:grid-cols-2 ${columns}`}>{children}</div>
    </fieldset>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900";

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "number";
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        step={type === "number" ? "any" : undefined}
        min={type === "number" ? 0 : undefined}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
