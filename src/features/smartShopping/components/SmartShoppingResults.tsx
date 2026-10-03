import { SearchX } from "lucide-react";
import type {
  SmartShoppingProduct,
  SmartShoppingVariant,
} from "../smartShopping.types";
import { SmartShoppingResultCard } from "./SmartShoppingResultCard";


interface SmartShoppingResultsProps {
  products: SmartShoppingProduct[];
  onAddToCart?: (
    product: SmartShoppingProduct,
    variant: SmartShoppingVariant,
  ) => void;
  addingVariantId?: string | null;
}

export function SmartShoppingResults({
  products,
  onAddToCart,
  addingVariantId = null,
}: SmartShoppingResultsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <SearchX className="h-5 w-5" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-900">
          I couldn't find a matching product
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
          Try changing your budget, category, color, brand, or other
          requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const variant = product.variants[0];

        return (
          <SmartShoppingResultCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isAddingToCart={variant?.id === addingVariantId}
          />
        );
      })}
    </div>
  );
}
