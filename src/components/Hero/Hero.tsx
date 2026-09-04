import type { HeroSlideData } from "../../types/homepage-ui";

interface HeroProps {
  slide: HeroSlideData;
}

export function Hero({ slide }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <picture>
        {slide.mobileImage && (
          <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
        )}

        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative mx-auto flex min-h-[560px] w-full max-w-[1440px] items-center px-6 py-20 sm:px-8 lg:px-12">
        <div
          className={[
            "max-w-xl text-white",
            slide.alignment === "center" && "mx-auto text-center",
            slide.alignment === "right" && "ml-auto text-right",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {slide.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              {slide.eyebrow}
            </p>
          )}

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {slide.title}
          </h1>

          {slide.description && (
            <p className="mt-5 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
              {slide.description}
            </p>
          )}

          {slide.href && slide.actionLabel && (
            <a
              href={slide.href}
              className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-transform hover:scale-[1.02]"
            >
              {slide.actionLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
