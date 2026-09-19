import { Plus } from "lucide-react";
import type { ProductFormVariant } from "../types/product-form.types";
import { ProductVariantEditor } from "./ProductVariantEditor";


interface ProductVariantsProps {
  variants: ProductFormVariant[];
  images: File[];

  onChange: (index: number, variant: ProductFormVariant) => void;

  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ProductVariants({
  variants,
  images,
  onChange,
  onAdd,
  onRemove,
}: ProductVariantsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Variants</h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure pricing, stock, shipping and variant-specific information.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          <Plus size={16} />
          Add variant
        </button>
      </div>

      <div className="space-y-5">
        {variants.map((variant, index) => (
          <ProductVariantEditor
            key={variant.id ?? `new-${index}`}
            variant={variant}
            index={index}
            totalVariants={variants.length}
            images={images}
            onChange={(nextVariant) => onChange(index, nextVariant)}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>
    </section>
  );
}
