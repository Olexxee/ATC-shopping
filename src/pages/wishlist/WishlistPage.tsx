import { useState } from "react";
import { ArrowLeft, Heart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { WishlistItemCard } from "../../components/wishlist/WishlistItemCard";
import { useWishlist } from "../../features/wishlist/wishlist.queries";
import { useRemoveFromWishlist } from "../../features/wishlist/wishlist.mutations";


const PAGE_SIZE = 20;

export default function WishlistPage() {
  const [page, setPage] = useState(1);
  const [removingProductId, setRemovingProductId] = useState<string | null>(
    null,
  );

  const wishlistQuery = useWishlist({
    page,
    limit: PAGE_SIZE,
  });

  const removeMutation = useRemoveFromWishlist();

  const items = wishlistQuery.data?.data ?? [];
  const meta = wishlistQuery.data?.meta;

  const handleRemove = (productId: string) => {
    setRemovingProductId(productId);

    removeMutation.mutate(productId, {
      onSuccess: () => {
        setRemovingProductId(null);

        if (items.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        }
      },
      onError: () => {
        setRemovingProductId(null);
      },
    });
  };

  if (wishlistQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-neutral-100" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index}>
              <div className="aspect-square animate-pulse rounded-2xl bg-neutral-100" />
              <div className="mt-4 h-3 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="mt-2 h-4 w-32 animate-pulse rounded bg-neutral-100" />
              <div className="mt-2 h-4 w-20 animate-pulse rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (wishlistQuery.isError) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
            <Heart size={28} className="text-neutral-400" />
          </div>

          <h1 className="mt-6 text-xl font-semibold text-neutral-950">
            We couldn't load your wishlist
          </h1>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Something went wrong while loading your saved products. Please try
            again.
          </p>

          <button
            type="button"
            onClick={() => wishlistQuery.refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
            <Heart size={34} className="text-neutral-400" strokeWidth={1.7} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-neutral-950">
            Your wishlist is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Save products you love and come back to them whenever you're ready.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8">
        <Link
          to="/products"
          className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-950"
        >
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <Heart size={25} className="text-red-500" fill="currentColor" />

              <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                My Wishlist
              </h1>
            </div>

            <p className="mt-2 text-sm text-neutral-500">
              {meta?.total ?? items.length}{" "}
              {(meta?.total ?? items.length) === 1
                ? "saved item"
                : "saved items"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <WishlistItemCard
            key={item.id}
            item={item}
            onRemove={handleRemove}
            isRemoving={removingProductId === item.productId}
          />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page <= 1}
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-3 text-sm text-neutral-500">
            {page} / {meta.totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page >= meta.totalPages}
            className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
