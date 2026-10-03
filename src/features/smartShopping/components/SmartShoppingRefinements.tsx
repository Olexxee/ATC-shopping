import { ArrowDown, Palette, RefreshCw, Sparkles, Truck } from "lucide-react";

interface SmartShoppingRefinementsProps {
  onRefine: (message: string) => void;
  disabled?: boolean;
}

const refinements = [
  {
    label: "Cheaper options",
    message: "Show me cheaper options.",
    icon: ArrowDown,
  },
  {
    label: "More options",
    message: "Show me more options.",
    icon: RefreshCw,
  },
  {
    label: "Different style",
    message: "Show me different styles.",
    icon: Palette,
  },
  {
    label: "Faster delivery",
    message: "Show me options with faster delivery.",
    icon: Truck,
  },
];

export function SmartShoppingRefinements({
  onRefine,
  disabled = false,
}: SmartShoppingRefinementsProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <Sparkles className="h-4 w-4" />
        Refine your search
      </div>

      <div className="flex flex-wrap gap-2">
        {refinements.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              disabled={disabled}
              onClick={() => onRefine(item.message)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
