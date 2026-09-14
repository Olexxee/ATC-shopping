import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  Address,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../../features/address/address.types";

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (payload: CreateAddressPayload | UpdateAddressPayload) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

interface FormState {
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const initialForm: FormState = {
  label: "",
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  country: "Nigeria",
  isDefault: false,
};

export default function AddressForm({
  address,
  onSubmit,
  onClose,
  isSubmitting = false,
}: AddressFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label ?? "",
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state ?? "",
        country: address.country || "Nigeria",
        isDefault: address.isDefault,
      });
    } else {
      setForm(initialForm);
    }
  }, [address]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      label: form.label.trim() || undefined,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      addressLine: form.addressLine.trim(),
      city: form.city.trim(),
      state: form.state.trim() || undefined,
      country: form.country.trim() || "Nigeria",
      isDefault: form.isDefault,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {address ? "Edit address" : "Add new address"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {address
                ? "Update your delivery information."
                : "Save an address for faster checkout."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Address label"
              value={form.label}
              onChange={(value) => updateField("label", value)}
              placeholder="Home"
            />

            <Field
              label="Full name"
              value={form.fullName}
              onChange={(value) => updateField("fullName", value)}
              placeholder="John Doe"
              required
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="08012345678"
              required
            />
          </div>

          <Field
            label="Address"
            value={form.addressLine}
            onChange={(value) => updateField("addressLine", value)}
            placeholder="12 Example Street"
            required
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
              placeholder="Lagos"
              required
            />

            <Field
              label="State"
              value={form.state}
              onChange={(value) => updateField("state", value)}
              placeholder="Lagos"
            />

            <Field
              label="Country"
              value={form.country}
              onChange={(value) => updateField("country", value)}
              placeholder="Nigeria"
              required
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                updateField("isDefault", event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300"
            />

            <span>
              <span className="block text-sm font-medium text-gray-900">
                Make this my default address
              </span>

              <span className="block text-xs text-gray-500">
                This address will be selected automatically at checkout.
              </span>
            </span>
          </label>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : address
                  ? "Save changes"
                  : "Save address"}
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
  type?: string;
  required?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
      />
    </label>
  );
}
