export function Hero() {
  return (
    <section className="overflow-hidden bg-neutral-100">
      <div className="mx-auto grid min-h-[560px] max-w-[1440px] items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:px-10 md:py-16 lg:min-h-[640px] lg:px-16 lg:py-20">
        {/* Content */}
        <div className="max-w-xl">
          <span className="mb-5 block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Global sourcing
          </span>

          <h1 className="max-w-lg text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Products from around the world.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-neutral-600 sm:text-lg">
            Discover products locally, or import what you can't find here.
            Simple access to products from markets around the world.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full bg-neutral-950 px-7 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Shop products
            </a>

            <a
              href="/importation"
              className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-300 bg-white px-7 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Explore importation
            </a>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 md:aspect-[4/5] lg:aspect-[5/6]">
            <img
              src="/hero-importation.jpg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-5 py-4 shadow-lg backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Import with confidence
            </p>

            <p className="mt-1 text-sm font-semibold text-neutral-950">
              From source to doorstep
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
