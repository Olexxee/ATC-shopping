import { Trash2 } from "lucide-react";
import type { ProductFormVariant } from "../types/product-form.types";

interface ProductVariantEditorProps {
  variant: ProductFormVariant;
  index: number;
  totalVariants: number;
  images: File[];

  onChange: (variant: ProductFormVariant) => void;

  onRemove: () => void;
}

export function ProductVariantEditor({
  variant,
  index,
  totalVariants,
  images,
  onChange,
  onRemove,
}: ProductVariantEditorProps) {
  const update = <K extends keyof ProductFormVariant>(
    field: K,
    value: ProductFormVariant[K],
  ) => {
    onChange({
      ...variant,
      [field]: value,
    });
  };

  const toggleImage = (imageIndex: number) => {
    const exists = variant.imageIndexes.includes(imageIndex);

    const nextIndexes = exists
      ? variant.imageIndexes.filter((index) => index !== imageIndex)
      : [...variant.imageIndexes, imageIndex];

    update("imageIndexes", nextIndexes);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Variant {index + 1}
          </p>

          {variant.id && (
            <p className="mt-1 text-xs text-slate-400">Existing variant</p>
          )}

          {!variant.id && (
            <p className="mt-1 text-xs text-slate-400">New variant</p>
          )}
        </div>

        {totalVariants > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      <div className="space-y-6">
        <VariantIdentity variant={variant} update={update} />

        <VariantPricing variant={variant} update={update} />

        <VariantShipping variant={variant} update={update} />

        <VariantImages
          variant={variant}
          images={images}
          toggleImage={toggleImage}
        />

        <VariantAvailability variant={variant} update={update} />
      </div>
    </div>
  );
}

interface VariantSectionProps {
  variant: ProductFormVariant;
  update: <K extends keyof ProductFormVariant>(
    field: K,
    value: ProductFormVariant[K],
  ) => void;
}

function VariantIdentity({ variant, update }: VariantSectionProps) {
  return (
    <VariantSection
      title="Variant identity"
      description="Define the SKU and variant attributes."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Field
          label="SKU"
          value={variant.sku}
          onChange={(value) => update("sku", value)}
          placeholder="e.g. SAM-S25-BLK-256"
        />

        <Field
          label="Color"
          value={variant.color}
          onChange={(value) => update("color", value)}
          placeholder="Black"
        />

        <Field
          label="Size"
          value={variant.size}
          onChange={(value) => update("size", value)}
          placeholder="256GB"
        />
      </div>
    </VariantSection>
  );
}

function VariantPricing({ variant, update }: VariantSectionProps) {
  return (
    <VariantSection
      title="Pricing & stock"
      description="Set the selling price and available inventory."
    >
      <div className="grid gap-4 md:grid-cols-4">
        <Field
          label="Price"
          type="number"
          value={variant.price}
          onChange={(value) => update("price", value)}
          min="0"
          step="0.01"
        />

        <Field
          label="Compare at price"
          type="number"
          value={variant.compareAtPrice}
          onChange={(value) => update("compareAtPrice", value)}
          min="0"
          step="0.01"
        />

        <Field
          label="Stock"
          type="number"
          value={variant.stock}
          onChange={(value) => update("stock", value)}
          min="0"
          step="1"
        />

        <Field
          label="Weight"
          type="number"
          value={variant.weight}
          onChange={(value) => update("weight", value)}
          min="0"
          step="0.01"
        />
      </div>
    </VariantSection>
  );
}

function VariantShipping({ variant, update }: VariantSectionProps) {
  return (
    <VariantSection
      title="Shipping"
      description="Configure fulfillment, shipping method and dimensions."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Fulfillment type"
          value={variant.fulfillmentType}
          onChange={(value) =>
            update(
              "fulfillmentType",
              value as ProductFormVariant["fulfillmentType"],
            )
          }
        >
          <option value="LOCAL">Local</option>

          <option value="IMPORT">Import</option>

          <option value="PREORDER">Preorder</option>

          <option value="DIGITAL">Digital</option>
        </SelectField>

        <SelectField
          label="Shipping type"
          value={variant.shippingType}
          onChange={(value) =>
            update("shippingType", value as ProductFormVariant["shippingType"])
          }
        >
          <option value="LOCAL">Local</option>

          <option value="IMPORT">Import</option>

          <option value="SEA">Sea</option>

          <option value="AIR">Air</option>

          <option value="DIGITAL">Digital</option>
        </SelectField>
      </div>

      <div className="mt-4">
        <Field
          label="Actual weight"
          type="number"
          value={variant.actualWeight}
          onChange={(value) => update("actualWeight", value)}
          min="0"
          step="0.01"
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field
          label="Length"
          type="number"
          value={variant.length}
          onChange={(value) => update("length", value)}
          min="0"
          step="0.01"
        />

        <Field
          label="Width"
          type="number"
          value={variant.width}
          onChange={(value) => update("width", value)}
          min="0"
          step="0.01"
        />

        <Field
          label="Height"
          type="number"
          value={variant.height}
          onChange={(value) => update("height", value)}
          min="0"
          step="0.01"
        />
      </div>
    </VariantSection>
  );
}

interface VariantImagesProps {
  variant: ProductFormVariant;
  images: File[];
  toggleImage: (index: number) => void;
}

function VariantImages({ variant, images, toggleImage }: VariantImagesProps) {
  return (
    <VariantSection
      title="Variant images"
      description="Existing images remain attached to this variant. Select any newly uploaded images that belong to it."
    >
      {variant.existingMedia.length > 0 && (
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Existing images
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {variant.existingMedia.map((media) => (
              <div
                key={media.id}
                className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <img
                  src={media.url}
                  alt={media.alt ?? "Product variant"}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          Add product images above to assign new images to this variant.
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            New images
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {images.map((image, imageIndex) => {
              const selected = variant.imageIndexes.includes(imageIndex);

              return (
                <button
                  type="button"
                  key={`${image.name}-${imageIndex}`}
                  onClick={() => toggleImage(imageIndex)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                    selected
                      ? "border-slate-900"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="h-full w-full object-cover"
                  />

                  {selected && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                      Assigned
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </VariantSection>
  );
}

function VariantAvailability({ variant, update }: VariantSectionProps) {
  return (
    <VariantSection
      title="Availability"
      description="Control whether this variant can be purchased."
    >
      <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Variant active</p>

          <p className="mt-1 text-xs text-slate-500">
            Active variants can be used for purchasing.
          </p>
        </div>

        <input
          type="checkbox"
          checked={variant.isActive}
          onChange={(event) => update("isActive", event.target.checked)}
          className="h-5 w-5 rounded border-slate-300"
        />
      </label>
    </VariantSection>
  );
}

interface VariantSectionContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function VariantSection({
  title,
  description,
  children,
}: VariantSectionContainerProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  min?: string;
  step?: string;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  step,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

function SelectField({ label, value, onChange, children }: SelectFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      >
        {children}
      </select>
    </div>
  );
}
