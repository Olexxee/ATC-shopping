import { useState } from "react";
import { AlertCircle, Check, Sparkles } from "lucide-react";

import { useSmartShopping } from "../../features/smartShopping/smartShopping.queries";
import { useSmartShoppingStore } from "../../features/smartShopping/smartShopping.store";

import { useAddCartItem } from "../../features/cart/cart.mutations";

import { SmartShoppingInput } from "../../features/smartShopping/components/SmartShoppingInput";
import { SmartShoppingResults } from "../../features/smartShopping/components/SmartShoppingResults";
import { SmartShoppingRefinements } from "../../features/smartShopping/components/SmartShoppingRefinements";
import { SmartShoppingEmptyState } from "../../features/smartShopping/components/SmartShoppingEmptyState";

import type {
  SmartShoppingProduct,
  SmartShoppingVariant,
} from "../../features/smartShopping/smartShopping.types";

export function SmartShoppingPage() {
  const { message, setMessage } = useSmartShoppingStore();

  const smartShoppingMutation = useSmartShopping();
  const addCartItemMutation = useAddCartItem();

  const [result, setResult] = useState<Awaited<
    ReturnType<typeof smartShoppingMutation.mutateAsync>
  > | null>(null);

  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);

  const submitSearch = (searchMessage?: string) => {
    const value = searchMessage?.trim() || message.trim();

    if (!value) {
      return;
    }

    setMessage(value);

    smartShoppingMutation.mutate(
      {
        message: value,
      },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      },
    );
  };

  const handleRefine = (refinement: string) => {
    submitSearch(refinement);
  };

  const handleExample = (example: string) => {
    setMessage(example);
    submitSearch(example);
  };

  const handleAddToCart = async (
    _product: SmartShoppingProduct,
    variant: SmartShoppingVariant,
  ) => {
    if (variant.stock <= 0) {
      return;
    }

    setAddedVariantId(variant.id);

    try {
      await addCartItemMutation.mutateAsync({
        variantId: variant.id,
        quantity: 1,
      });
    } finally {
      setAddedVariantId(null);
    }
  };

  const isSearching = smartShoppingMutation.isPending;

  const isAddingToCart = addCartItemMutation.isPending;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Keplex Smart Shopping
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tell us what you're looking for.
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Describe what you need in your own words. We'll search the Keplex
            catalog and show you products that actually match.
          </p>

          <div className="mt-7 text-left">
            <SmartShoppingInput
              value={message}
              onChange={setMessage}
              onSubmit={() => submitSearch()}
              isLoading={isSearching}
              autoFocus
            />
          </div>
        </section>

        {smartShoppingMutation.isError && (
          <div
            role="alert"
            className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-semibold">
                Smart Shopping couldn't complete the search.
              </p>

              <p className="mt-1">Please try again.</p>
            </div>
          </div>
        )}

        {addCartItemMutation.isError && (
          <div
            role="alert"
            className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <p>We couldn't add that item to your cart. Please try again.</p>
          </div>
        )}

        {addedVariantId && (
          <div className="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Check className="h-4 w-4" />
            Item added to your cart.
          </div>
        )}

        {!result && !isSearching && (
          <SmartShoppingEmptyState onExample={handleExample} />
        )}

        {result && (
          <section className="mt-12">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Results
              </p>

              <h2 className="mt-2 text-xl font-bold text-gray-900">
                {result.summary}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {result.meta.total}{" "}
                {result.meta.total === 1 ? "option" : "options"} found.
              </p>
            </div>

            <SmartShoppingResults
              products={result.products}
              onAddToCart={handleAddToCart}
              addingVariantId={addedVariantId}
            />

            <div className="mt-8">
              <SmartShoppingRefinements
                onRefine={handleRefine}
                disabled={isSearching || isAddingToCart}
              />
            </div>
          </section>
        )}

        {isSearching && (
          <section className="mt-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <div className="aspect-square animate-pulse bg-gray-100" />

                  <div className="space-y-3 p-4">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />

                    <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100" />

                    <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
