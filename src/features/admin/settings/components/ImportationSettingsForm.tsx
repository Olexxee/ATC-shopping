import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useUpdateBusinessConfig } from "../businessConfig.mutations";
import type { ImportationSettings } from "../businessConfig.types";


interface ImportationSettingsFormProps {
  settings: ImportationSettings;
}

export function ImportationSettingsForm({
  settings,
}: ImportationSettingsFormProps) {
  const updateConfig = useUpdateBusinessConfig();

  const [form, setForm] = useState<ImportationSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const updateField = (field: keyof ImportationSettings, value: boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await updateConfig.mutateAsync({
      key: "importation_settings",
      value: form,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {" "}
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
        <Toggle
          label="Enable importation"
          description="Enable the importation feature across the store."
          checked={form.enabled}
          onChange={(checked) => updateField("enabled", checked)}
        />
        <Toggle
          label="Show on landing page"
          description="Display importation content on the public landing page."
          checked={form.showOnLandingPage}
          onChange={(checked) => updateField("showOnLandingPage", checked)}
        />

        <Toggle
          label="Show in store"
          description="Allow imported products or categories to appear in the store."
          checked={form.showInStore}
          onChange={(checked) => updateField("showInStore", checked)}
        />
      </div>
      <SaveButton
        isPending={updateConfig.isPending}
        isSuccess={updateConfig.isSuccess}
        isError={updateConfig.isError}
      />
    </form>
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
    <div className="flex items-center justify-between gap-6 px-4 py-4">
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
    </div>
  );
}

interface SaveButtonProps {
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
}

function SaveButton({ isPending, isSuccess, isError }: SaveButtonProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      {isSuccess && (
        <span className="text-sm text-emerald-600">Saved successfully. </span>
      )}

      {isError && (
        <span className="text-sm text-red-600">Unable to save changes.</span>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={16} />

        {isPending ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}
