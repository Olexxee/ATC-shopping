import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  useCreateShippingRule,
  useUpdateShippingRule,
} from "../shipping.mutations";
import type {
  ShippingRule,
  ShippingType,
} from "../shipping.types";

interface ShippingRuleFormProps {
  configurationId: string;
  rule?: ShippingRule | null;
  onClose: () => void;
}

interface FormState {
  name: string;
  type: ShippingType;
  isActive: boolean;
  minSubtotal: string;
  maxSubtotal: string;
  minWeight: string;
  maxWeight: string;
  baseRate: string;
  ratePerKg: string;
  ratePerCBM: string;
  priority: string;
}

const DEFAULT_FORM: FormState = {
  name: "",
  type: "DEFAULT",
  isActive: true,
  minSubtotal: "",
  maxSubtotal: "",
  minWeight: "",
  maxWeight: "",
  baseRate: "0",
  ratePerKg: "0",
  ratePerCBM: "0",
  priority: "0",
};

function valueToString(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function ShippingRuleForm({
  configurationId,
  rule,
  onClose,
}: ShippingRuleFormProps) {
  const createMutation = useCreateShippingRule();
  const updateMutation = useUpdateShippingRule();

  const isEditing = Boolean(rule);
  const isPending =
    createMutation.isPending || updateMutation.isPending;

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  useEffect(() => {
    if (!rule) {
      setForm(DEFAULT_FORM);
      return;
    }

    setForm({
      name: rule.name,
      type: rule.type,
      isActive: rule.isActive,
      minSubtotal: valueToString(rule.minSubtotal),
      maxSubtotal: valueToString(rule.maxSubtotal),
      minWeight: valueToString(rule.minWeight),
      maxWeight: valueToString(rule.maxWeight),
      baseRate: valueToString(rule.baseRate),
      ratePerKg: valueToString(rule.ratePerKg),
      ratePerCBM: valueToString(rule.ratePerCBM),
      priority: valueToString(rule.priority),
    });
  }, [rule]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function optionalNumber(value: string) {
    return value === "" ? null : Number(value);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const commonPayload = {
      name: form.name.trim(),
      type: form.type,
      isActive: form.isActive,
      minSubtotal: optionalNumber(form.minSubtotal),
      maxSubtotal: optionalNumber(form.maxSubtotal),
      minWeight: optionalNumber(form.minWeight),
      maxWeight: optionalNumber(form.maxWeight),
      baseRate: Number(form.baseRate || 0),
      ratePerKg: Number(form.ratePerKg || 0),
      ratePerCBM: Number(form.ratePerCBM || 0),
      priority: Number(form.priority || 0),
    };

    if (rule) {
      await updateMutation.mutateAsync({
        id: rule.id,
        payload: commonPayload,
      });
    } else {
      await createMutation.mutateAsync({
        configurationId,
        ...commonPayload,
      });
    }

    onClose();
  }

  const mutationError =
    createMutation.error || updateMutation.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {isEditing ? "Edit shipping rule" : "Add shipping rule"}
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Define when this rule applies and how shipping is calculated.
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Rule name
              </label>

              <input
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="e.g. Lagos Local Delivery"
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Shipping type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  updateField(
                    "type",
                    event.target.value as ShippingType,
                  )
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              >
                <option value="DEFAULT">Default</option>
                <option value="LOCAL">Local</option>
                <option value="IMPORT">Import</option>
                <option value="SEA">Sea</option>
                <option value="AIR">Air</option>
                <option value="DIGITAL">Digital</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Priority
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={form.priority}
                onChange={(event) =>
                  updateField("priority", event.target.value)
                }
                className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
              />

              <p className="mt-1 text-xs text-neutral-500">
                Lower numbers are evaluated first.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                  className="h-4 w-4 rounded border-neutral-300"
                />

                <span className="text-sm font-medium text-neutral-700">
                  Rule is active
                </span>
              </label>
            </div>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-neutral-950">
              Conditions
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Minimum subtotal"
                value={form.minSubtotal}
                onChange={(value) =>
                  updateField("minSubtotal", value)
                }
              />

              <Field
                label="Maximum subtotal"
                value={form.maxSubtotal}
                onChange={(value) =>
                  updateField("maxSubtotal", value)
                }
              />

              <Field
                label="Minimum chargeable weight"
                value={form.minWeight}
                onChange={(value) =>
                  updateField("minWeight", value)
                }
              />

              <Field
                label="Maximum chargeable weight"
                value={form.maxWeight}
                onChange={(value) =>
                  updateField("maxWeight", value)
                }
              />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-neutral-950">
              Pricing
            </h3>

            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Base rate"
                value={form.baseRate}
                onChange={(value) =>
                  updateField("baseRate", value)
                }
              />

              <Field
                label="Rate per KG"
                value={form.ratePerKg}
                onChange={(value) =>
                  updateField("ratePerKg", value)
                }
              />

              <Field
                label="Rate per CBM"
                value={form.ratePerCBM}
                onChange={(value) =>
                  updateField("ratePerCBM", value)
                }
              />
            </div>
          </section>

          {mutationError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to save shipping rule.
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
                  : "Create rule"}
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
}

function Field({ label, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
      />
    </div>
  );
}