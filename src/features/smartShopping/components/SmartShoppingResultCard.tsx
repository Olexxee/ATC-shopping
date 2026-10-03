import { ArrowRight, Check, Package, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import type {
  SmartShoppingProduct,
  SmartShoppingVariant,
} from "../smartShopping.types";

interface SmartShoppingResultCardProps {
  product: SmartShoppingProduct;
  onAddToCart?: (
    product: SmartShoppingProduct,
    variant: SmartShoppingVariant,
  ) => void;
  isAddingToCart?: boolean;
}

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPrimaryImage(product: SmartShoppingProduct) {
  const variantWithImage = product.variants.find(
    (variant) => variant.media.length > 0,
  );

  return variantWithImage?.media[0]?.url ?? null;
}

function getDisplayVariant(
  product: SmartShoppingProduct,
): SmartShoppingVariant | null {
  return product.variants[0] ?? null;
}

function getFulfillmentLabel(variant: SmartShoppingVariant) {
  switch (variant.fulfillmentType) {
    case "LOCAL":
      return "Local fulfillment";

    case "IMPORT":
      return "Import fulfillment";

    case "PREORDER":
      return "Pre-order";

    case "DIGITAL":
      return "Digital";

    default:
      return variant.fulfillmentType;
  }
}

export function SmartShoppingResultCard({
  product,
  onAddToCart,
  isAddingToCart = false,
}: SmartShoppingResultCardProps) {
  const image = getPrimaryImage(product);
  const variant = getDisplayVariant(product);

  if (!variant) {
    return null;
  }

  const shippingAvailable = product.shipping.status === "AVAILABLE";

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Package className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="min-h-[48px]">
          {product.brand && (
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {product.brand.name}
            </p>
          )}

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
            {product.name}
          </h3>
        </div>

        <div className="mt-3">
          {product.price.min === product.price.max ? (
            <p className="text-lg font-bold text-gray-900">
              {formatNaira(product.price.min)}
            </p>
          ) : (
            <p className="text-lg font-bold text-gray-900">
              {formatNaira(product.price.min)}
              <span className="font-normal text-gray-400">
                {" "}
                – {formatNaira(product.price.max)}
              </span>
            </p>
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Check className="h-3.5 w-3.5 text-green-600" />
            <span>
              {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Package className="h-3.5 w-3.5 text-gray-500" />
            <span>{getFulfillmentLabel(variant)}</span>
          </div>

          {shippingAvailable && product.shipping.shippingCost !== null && (
            <div className="text-xs text-gray-600">
              Shipping{" "}
              <span className="font-medium text-gray-900">
                {formatNaira(product.shipping.shippingCost)}
              </span>
            </div>
          )}
        </div>

        {product.shipping.status === "UNAVAILABLE" && (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            Shipping quote is currently unavailable for this option.
          </p>
        )}

        <div className="mt-5 flex gap-2">
          <Link
            to={`/products/${product.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            disabled={isAddingToCart || variant.stock <= 0}
            onClick={() => onAddToCart?.(product, variant)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />

            {isAddingToCart ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
