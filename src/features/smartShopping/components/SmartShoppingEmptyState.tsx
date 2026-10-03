import { Gift, Search, ShoppingBag } from "lucide-react";

interface SmartShoppingEmptyStateProps {
  onExample: (message: string) => void;
}

const examples = [
  {
    icon: Gift,
    title: "Find a gift",
    message: "I need a gift for my sister around ₦50k.",
  },
  {
    icon: ShoppingBag,
    title: "Shop by budget",
    message: "I need something useful under ₦100k.",
  },
  {
    icon: Search,
    title: "Find a product",
    message: "I need a black backpack for work.",
  },
];


export function SmartShoppingEmptyState({
  onExample,
}: SmartShoppingEmptyStateProps) {
  return (
    <div className="mt-8">
      <p className="mb-4 text-center text-sm text-gray-500">
        Not sure what to search for? Try one of these.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {examples.map((example) => {
          const Icon = example.icon;

          return (
            <button
              key={example.title}
              type="button"
              onClick={() => onExample(example.message)}
              className="rounded-2xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm"
            >
              <Icon className="h-5 w-5 text-gray-500" />

              <p className="mt-3 text-sm font-semibold text-gray-900">
                {example.title}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {example.message}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
