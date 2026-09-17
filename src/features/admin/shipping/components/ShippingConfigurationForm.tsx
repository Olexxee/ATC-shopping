import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import type { ShippingConfiguration, ShippingStatus } from "../shipping.types";
import { useUpdateShippingConfiguration } from "../shipping.mutations";

interface ShippingConfigurationFormProps {
  configuration: ShippingConfiguration;
}

interface FormState {
  name: string;
  status: ShippingStatus;
  pricePerKg: string;
  pricePerCBM: string;
  handlingFee: string;
  minCharge: string;
  freeShippingThreshold: string;
}

function toInputValue(value: number | string | null | undefined) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function ShippingConfigurationForm({
  configuration,
}: ShippingConfigurationFormProps) {
  const updateMutation = useUpdateShippingConfiguration();

  const [form, setForm] = useState<FormState>({
    name: configuration.name,
    status: configuration.status,
    pricePerKg: toInputValue(configuration.pricePerKg),
    pricePerCBM: toInputValue(configuration.pricePerCBM),
    handlingFee: toInputValue(configuration.handlingFee),
    minCharge: toInputValue(configuration.minCharge),
    freeShippingThreshold: toInputValue(configuration.freeShippingThreshold),
  });

  useEffect(() => {
    setForm({
      name: configuration.name,
      status: configuration.status,
      pricePerKg: toInputValue(configuration.pricePerKg),
      pricePerCBM: toInputValue(configuration.pricePerCBM),
      handlingFee: toInputValue(configuration.handlingFee),
      minCharge: toInputValue(configuration.minCharge),
      freeShippingThreshold: toInputValue(configuration.freeShippingThreshold),
    });
  }, [configuration]);

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

    await updateMutation.mutateAsync({
      id: configuration.id,
      payload: {
        name: form.name.trim(),
        status: form.status,
        pricePerKg: Number(form.pricePerKg || 0),
        pricePerCBM: Number(form.pricePerCBM || 0),
        handlingFee: Number(form.handlingFee || 0),
        minCharge: Number(form.minCharge || 0),
        freeShippingThreshold:
          form.freeShippingThreshold === ""
            ? null
            : Number(form.freeShippingThreshold),
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Configuration name
          </label>

          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Status
          </label>

          <select
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value as ShippingStatus)
            }
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div />

        <Field
          label="Price per KG"
          value={form.pricePerKg}
          onChange={(value) => updateField("pricePerKg", value)}
        />

        <Field
          label="Price per CBM"
          value={form.pricePerCBM}
          onChange={(value) => updateField("pricePerCBM", value)}
        />

        <Field
          label="Handling fee"
          value={form.handlingFee}
          onChange={(value) => updateField("handlingFee", value)}
        />

        <Field
          label="Minimum charge"
          value={form.minCharge}
          onChange={(value) => updateField("minCharge", value)}
        />

        <Field
          label="Free shipping threshold"
          value={form.freeShippingThreshold}
          onChange={(value) => updateField("freeShippingThreshold", value)}
          placeholder="Leave empty to disable"
        />
      </div>

      <div className="flex justify-end border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />

          {updateMutation.isPending ? "Saving..." : "Save configuration"}
        </button>
      </div>

      {updateMutation.isSuccess && (
        <p className="text-sm text-green-600">
          Shipping configuration saved successfully.
        </p>
      )}

      {updateMutation.isError && (
        <p className="text-sm text-red-600">
          Failed to save shipping configuration.
        </p>
      )}
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Field({ label, value, onChange, placeholder }: FieldProps) {
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
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
      />
    </div>
  );
}
