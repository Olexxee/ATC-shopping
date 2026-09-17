import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { useUpdateBusinessConfig } from "../businessConfig.mutations";
import type { PricingRules } from "../businessConfig.types";

interface PricingRulesFormProps {
settings: PricingRules;
}

export function PricingRulesForm({
settings,
}: PricingRulesFormProps) {
const updateConfig = useUpdateBusinessConfig();

const [form, setForm] = useState<PricingRules>(settings);

useEffect(() => {
setForm(settings);
}, [settings]);

const updateField = (
field: keyof PricingRules,
value: number,
) => {
setForm((current) => ({
...current,
[field]: value,
}));
};

const updateTrainingPromo = (
field: "active" | "percent",
value: boolean | number,
) => {
setForm((current) => ({
...current,
trainingPromo: {
...current.trainingPromo,
[field]: value,
},
}));
};

const handleSubmit = async (
event: React.FormEvent<HTMLFormElement>,
) => {
event.preventDefault();

await updateConfig.mutateAsync({
  key: "pricing_rules",
  value: form,
});

};

return ( <form onSubmit={handleSubmit} className="space-y-6"> <div className="grid gap-5 sm:grid-cols-2">
<NumberField
label="Global discount"
description="Percentage discount applied globally."
value={form.globalDiscount}
min={0}
max={100}
onChange={(value) =>
updateField("globalDiscount", value)
}
suffix="%"
/> </div>

  <div className="rounded-lg border border-slate-200">
    <div className="border-b border-slate-200 px-4 py-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Training promotion
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Configure the promotional discount for training products.
      </p>
    </div>

    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-slate-900">
            Active
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Enable the training promotion.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={form.trainingPromo.active}
          onClick={() =>
            updateTrainingPromo(
              "active",
              !form.trainingPromo.active,
            )
          }
          className={[
            "relative h-6 w-11 shrink-0 rounded-full transition",
            form.trainingPromo.active
              ? "bg-slate-900"
              : "bg-slate-300",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 h-4 w-4 rounded-full bg-white transition",
              form.trainingPromo.active
                ? "left-6"
                : "left-1",
            ].join(" ")}
          />
        </button>
      </div>

      <NumberField
        label="Promotion percentage"
        description="Discount percentage applied to training products."
        value={form.trainingPromo.percent}
        min={0}
        max={100}
        onChange={(value) =>
          updateTrainingPromo("percent", value)
        }
        suffix="%"
      />
    </div>
  </div>

  <div className="flex items-center justify-end gap-4">
    {updateConfig.isSuccess && (
      <span className="text-sm text-emerald-600">
        Saved successfully.
      </span>
    )}

    {updateConfig.isError && (
      <span className="text-sm text-red-600">
        Unable to save changes.
      </span>
    )}

    <button
      type="submit"
      disabled={updateConfig.isPending}
      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Save size={16} />

      {updateConfig.isPending
        ? "Saving..."
        : "Save changes"}
    </button>
  </div>
</form>


);
}

interface NumberFieldProps {
label: string;
description: string;
value: number;
min?: number;
max?: number;
suffix?: string;
onChange: (value: number) => void;
}

function NumberField({
label,
description,
value,
min,
max,
suffix,
onChange,
}: NumberFieldProps) {
return ( <div> <label className="block text-sm font-medium text-slate-700">
{label} </label>

  <p className="mt-1 text-xs text-slate-500">
    {description}
  </p>

  <div className="relative mt-2">
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step="0.01"
      onChange={(event) =>
        onChange(Number(event.target.value))
      }
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-10 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
    />

    {suffix && (
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-400">
        {suffix}
      </span>
    )}
  </div>
</div>

);
}
