import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useCreateWarehouse, useUpdateWarehouse } from "../warehouse.mutations";

import type { Warehouse, WarehouseType } from "../warehouse.types";

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onClose: () => void;
}

interface FormState {
  name: string;
  code: string;
  type: WarehouseType;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

const DEFAULT_FORM: FormState = {
  name: "",
  code: "",
  type: "LOCAL",
  address: "",
  city: "",
  state: "",
  country: "",
  isActive: true,
};

export function WarehouseForm({ warehouse, onClose }: WarehouseFormProps) {
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();

  const isEditing = Boolean(warehouse);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    if (!warehouse) {
      setForm(DEFAULT_FORM);
      return;
    }

    setForm({
      name: warehouse.name,
      code: warehouse.code,
      type: warehouse.type,
      address: warehouse.address ?? "",
      city: warehouse.city ?? "",
      state: warehouse.state ?? "",
      country: warehouse.country ?? "",
      isActive: warehouse.isActive,
    });
  }, [warehouse]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      type: form.type,
      address: form.address.trim() || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      country: form.country.trim() || null,
      isActive: form.isActive,
    };

    if (warehouse) {
      await updateMutation.mutateAsync({
        id: warehouse.id,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onClose();
  }

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {isEditing ? "Edit warehouse" : "Add warehouse"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Configure the warehouse used for order fulfillment.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Warehouse name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
              placeholder="Lagos Main Warehouse"
              required
            />

            <Field
              label="Warehouse code"
              value={form.code}
              onChange={(value) => updateField("code", value.toUpperCase())}
              placeholder="LAG-LOCAL"
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Warehouse type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  updateField("type", event.target.value as WarehouseType)
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              >
                <option value="LOCAL">Local</option>
                <option value="IMPORT">Import</option>
                <option value="PREORDER">Preorder</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-3 pb-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-neutral-300"
                />

                <span className="text-sm font-medium text-neutral-700">
                  Warehouse is active
                </span>
              </label>
            </div>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-neutral-950">
              Location
            </h3>

            <div className="space-y-5">
              <Field
                label="Address"
                value={form.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Warehouse street address"
              />

              <div className="grid gap-5 md:grid-cols-3">
                <Field
                  label="City"
                  value={form.city}
                  onChange={(value) => updateField("city", value)}
                />

                <Field
                  label="State"
                  value={form.state}
                  onChange={(value) => updateField("state", value)}
                />

                <Field
                  label="Country"
                  value={form.country}
                  onChange={(value) => updateField("country", value)}
                />
              </div>
            </div>
          </section>

          {mutationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to save warehouse.
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-neutral-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

function Field({ label, value, onChange, placeholder, required }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
      />
    </div>
  );
}
