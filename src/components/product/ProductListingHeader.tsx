interface ProductListingHeaderProps {
  title: string;
  description?: string;
}

export function ProductListingHeader({
  title,
  description,
}: ProductListingHeaderProps) {
  return (
    <header className="pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16">
      <div className="max-w-3xl">
        <h1
          className="
            text-3xl
            font-semibold
            leading-tight
            tracking-[-0.02em]
            text-[var(--text-primary)]
            sm:text-4xl
            lg:text-5xl
          "
        >
          {title}
        </h1>

        {description && (
          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-relaxed
              text-[var(--text-secondary)]
              sm:text-base
            "
          >
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
