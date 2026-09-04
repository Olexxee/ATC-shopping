interface ProductListingHeaderProps {
  title: string;
  description?: string;
}

export function ProductListingHeader({
  title,
  description,
}: ProductListingHeaderProps) {
  return (
    <header className="py-10 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
