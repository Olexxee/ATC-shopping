import { useEffect, useRef } from "react";

interface ProductInfiniteLoaderProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function ProductInfiniteLoader({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ProductInfiniteLoaderProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const trigger = triggerRef.current;

    if (!trigger || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry?.isIntersecting && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-neutral-400">You’ve reached the end.</p>
      </div>
    );
  }

  return (
    <div
      ref={triggerRef}
      className="flex min-h-24 items-center justify-center"
      aria-hidden="true"
    >
      {isFetchingNextPage && (
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />
      )}
    </div>
  );
}
