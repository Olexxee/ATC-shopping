import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import type { StoreSettings } from "../businessConfig.types";
import { useUpdateBusinessConfig } from "../businessConfig.mutations";

interface StoreSettingsFormProps {
  settings: StoreSettings;
}

export function StoreSettingsForm({ settings }: StoreSettingsFormProps) {
  const updateConfig = useUpdateBusinessConfig();

  const [form, setForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = <K extends keyof StoreSettings>(
    field: K,
    value: StoreSettings[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSocialLink = (field: string, value: string) => {
    setForm((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateConfig.mutateAsync({
      key: "store_settings",
      value: form,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General */}{" "}
      <section className="rounded-xl border border-slate-200 bg-white">
        {" "}
        <div className="border-b border-slate-200 px-5 py-4">
          {" "}
          <h2 className="text-sm font-semibold text-slate-900">General </h2>
          <p className="mt-1 text-xs text-slate-500">
            Basic information about your store.
          </p>
        </div>
        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Field
            label="Company name"
            value={form.companyName}
            onChange={(value) => updateField("companyName", value)}
            placeholder="Keplex"
          />

          <Field
            label="Phone"
            value={form.phone ?? ""}
            onChange={(value) => updateField("phone", value || null)}
            placeholder="+234..."
          />

          <Field
            label="Email"
            type="email"
            value={form.email ?? ""}
            onChange={(value) => updateField("email", value || null)}
            placeholder="support@keplex.com"
          />

          <Field
            label="Logo URL"
            value={form.logo ?? ""}
            onChange={(value) => updateField("logo", value || null)}
            placeholder="https://..."
          />

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              value={form.address ?? ""}
              onChange={(event) =>
                updateField("address", event.target.value || null)
              }
              rows={3}
              placeholder="Store address"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>
      </section>
      {/* Social links */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Social Links</h2>

          <p className="mt-1 text-xs text-slate-500">
            Add the social profiles displayed across the store.
          </p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <Field
            label="Facebook"
            value={form.socialLinks.facebook ?? ""}
            onChange={(value) => updateSocialLink("facebook", value)}
            placeholder="https://facebook.com/..."
          />

          <Field
            label="Instagram"
            value={form.socialLinks.instagram ?? ""}
            onChange={(value) => updateSocialLink("instagram", value)}
            placeholder="https://instagram.com/..."
          />

          <Field
            label="X / Twitter"
            value={form.socialLinks.twitter ?? ""}
            onChange={(value) => updateSocialLink("twitter", value)}
            placeholder="https://x.com/..."
          />

          <Field
            label="TikTok"
            value={form.socialLinks.tiktok ?? ""}
            onChange={(value) => updateSocialLink("tiktok", value)}
            placeholder="https://tiktok.com/@..."
          />

          <Field
            label="YouTube"
            value={form.socialLinks.youtube ?? ""}
            onChange={(value) => updateSocialLink("youtube", value)}
            placeholder="https://youtube.com/..."
          />
        </div>
      </section>
      {/* Homepage */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Homepage</h2>

          <p className="mt-1 text-xs text-slate-500">
            Control how selected store content appears.
          </p>
        </div>

        <div className="space-y-5 p-5">
          <Toggle
            label="Show imported category"
            description="Display imported products as a category in the store."
            checked={form.showImportedCategory}
            onChange={(checked) => updateField("showImportedCategory", checked)}
          />
        </div>
      </section>
      {/* Save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={updateConfig.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />

          {updateConfig.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
      {updateConfig.isSuccess && (
        <p className="text-right text-sm text-emerald-600">
          Store settings saved successfully.
        </p>
      )}
      {updateConfig.isError && (
        <p className="text-right text-sm text-red-600">
          Unable to save store settings.
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
  type?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <div>
      {" "}
      <label className="block text-sm font-medium text-slate-700">
        {label}{" "}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
      />
    </div>
  );
}

interface ToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6">
      {" "}
      <div>
        {" "}
        <p className="text-sm font-medium text-slate-900">{label} </p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-slate-900" : "bg-slate-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white transition",
            checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </label>
  );
}
