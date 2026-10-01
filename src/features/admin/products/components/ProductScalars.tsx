import { useId, type ReactNode } from "react";
import type { AdminProductDetail } from "../../../../api/product/product.contract";
import {
  useProductBrands,
  useProductCategories,
  useProductCollections,
} from "../hooks/useProductOptions";

type OnChange = <K extends keyof AdminProductDetail>(
  field: K,
  value: AdminProductDetail[K],
) => void;

interface SectionProps {
  values: AdminProductDetail;
  onChange: OnChange;
}

const controlClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400";

// ============================================================================
// SECTIONS
// ============================================================================

/** Name, slug and description. Main column. */
export function ProductDetailsSection({ values, onChange }: SectionProps) {
  return (
    <Card title="Product details">
      <div className="space-y-5">
        <Field label="Name">
          {(id) => (
            <input
              id={id}
              type="text"
              value={values.name}
              onChange={(e) => onChange("name", e.target.value)}
              className={controlClass}
            />
          )}
        </Field>

        <Field label="Slug" hint="Used in the product URL. Lowercase only.">
          {(id) => (
            <input
              id={id}
              type="text"
              value={values.slug}
              onChange={(e) => onChange("slug", e.target.value.toLowerCase())}
              className={controlClass}
            />
          )}
        </Field>

        <Field label="Description">
          {(id) => (
            <textarea
              id={id}
              rows={7}
              value={values.description ?? ""}
              onChange={(e) => onChange("description", e.target.value)}
              className={`${controlClass} resize-y leading-relaxed`}
            />
          )}
        </Field>
      </div>
    </Card>
  );
}

/** Status and visibility switches. Sidebar. */
export function ProductStatusSection({ values, onChange }: SectionProps) {
  return (
    <Card title="Status" compact>
      <Field label="Status" hideLabel>
        {(id) => (
          <select
            id={id}
            value={values.status}
            onChange={(e) =>
              onChange("status", e.target.value as AdminProductDetail["status"])
            }
            className={controlClass}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        )}
      </Field>

      <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
        <SwitchRow
          label="Featured"
          description="Show in featured areas."
          checked={values.isFeatured}
          onChange={(v) => onChange("isFeatured", v)}
        />
        <SwitchRow
          label="New product"
          description="Mark as a new arrival."
          checked={values.isNew}
          onChange={(v) => onChange("isNew", v)}
        />
        <SwitchRow
          label="Best seller"
          description="Mark as a best seller."
          checked={values.isBestSeller}
          onChange={(v) => onChange("isBestSeller", v)}
        />
      </div>
    </Card>
  );
}

/** Category, brand and collection. Sidebar. */
export function ProductOrganizationSection({ values, onChange }: SectionProps) {
  const { data: brands = [], isLoading: brandsLoading } = useProductBrands();
  const { data: categories = [], isLoading: categoriesLoading } =
    useProductCategories();
  const { data: collections = [], isLoading: collectionsLoading } =
    useProductCollections();

  return (
    <Card title="Organization" compact>
      <div className="space-y-4">
        <Field label="Category">
          {(id) => (
            <select
              id={id}
              value={values.categoryId}
              onChange={(e) => onChange("categoryId", e.target.value)}
              disabled={categoriesLoading}
              className={controlClass}
            >
              <option value="">
                {categoriesLoading ? "Loading..." : "Select category"}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Brand">
          {(id) => (
            <select
              id={id}
              value={values.brandId ?? ""}
              onChange={(e) => onChange("brandId", e.target.value || null)}
              disabled={brandsLoading}
              className={controlClass}
            >
              <option value="">
                {brandsLoading ? "Loading..." : "No brand"}
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Collection">
          {(id) => (
            <select
              id={id}
              value={values.collectionId ?? ""}
              onChange={(e) => onChange("collectionId", e.target.value || null)}
              disabled={collectionsLoading}
              className={controlClass}
            >
              <option value="">
                {collectionsLoading ? "Loading..." : "No collection"}
              </option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
    </Card>
  );
}

/** Backwards-compatible stacked version of all three sections. */
export function ProductScalars({ values, onChange }: SectionProps) {
  return (
    <div className="space-y-6">
      <ProductDetailsSection values={values} onChange={onChange} />
      <ProductOrganizationSection values={values} onChange={onChange} />
      <ProductStatusSection values={values} onChange={onChange} />
    </div>
  );
}

// ============================================================================
// PRIMITIVES
// ============================================================================

function Card({
  title,
  compact = false,
  children,
}: {
  title: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  hideLabel = false,
  children,
}: {
  label: string;
  hint?: string;
  hideLabel?: boolean;
  children: (id: string) => ReactNode;
}) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className={
          hideLabel
            ? "sr-only"
            : "mb-1.5 block text-sm font-medium text-slate-700"
        }
      >
        {label}
      </label>
      {children(id)}
      {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
          checked ? "bg-slate-900" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
