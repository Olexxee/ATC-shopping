import { ArrowRight, PackageSearch, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";

const FEATURES = [
  {
    icon: PackageSearch,
    title: "Tell us what you need",
    description:
      "Describe the product, add a link, or upload a photo. That's all we need to start.",
  },
  {
    icon: Sparkles,
    title: "We identify it",
    description:
      "Our system checks the Keplex catalog first — if we already stock it, you're one tap away.",
  },
  {
    icon: Truck,
    title: "We source it",
    description:
      "Not in stock? We source from international markets and bring it to your doorstep.",
  },
];

export function ImportationBanner() {
  return (
    <Section className="relative overflow-hidden bg-[var(--surface-dark)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="
            absolute
            -right-24
            -top-32
            h-96
            w-96
            rounded-full
            bg-[var(--brand)]
            opacity-10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-white
            opacity-[0.03]
            blur-3xl
          "
        />
      </div>

      <Container>
        <div
          className="
            relative
            grid
            items-center
            gap-12
            lg:grid-cols-[1.1fr_0.9fr]
            lg:gap-16
          "
        >
          <div className="max-w-2xl">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-md
                border
                border-white/10
                bg-white/[0.04]
                px-3
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white/75
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[var(--brand-400)]
                "
              />

              Global sourcing
            </span>

            <h2
              className="
                mt-6
                text-3xl
                font-semibold
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-[2.75rem]
                lg:leading-[1.1]
              "
            >
              Can't find what
              <br className="hidden sm:block" /> you're looking for?
            </h2>

            <p
              className="
                mt-5
                max-w-xl
                text-base
                leading-7
                text-white/65
                sm:text-lg
                sm:leading-8
              "
            >
              Send us the product name, a link, or a photo. We'll search our
              catalog first — and if it's not there, we'll source it from
              international markets and bring it to you.
            </p>

            <div
              className="
                mt-7
                flex
                flex-col
                gap-3
                sm:flex-row
                sm:items-center
              "
            >
              <Link
                to="/sourcing"
                className="
                  group
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-[var(--text-primary)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--brand-soft)]
                  hover:text-[var(--brand)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--surface-dark)]
                "
              >
                Start a sourcing request

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="
                    transition-transform
                    duration-200
                    group-hover:translate-x-0.5
                  "
                />
              </Link>

              <Link
                to="/products"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  border
                  border-white/20
                  bg-transparent
                  px-5
                  text-sm
                  font-semibold
                  !text-white
                  transition-colors
                  duration-200
                  hover:border-white/35
                  hover:bg-white/[0.06]
                  hover:!text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--surface-dark)]
                "
              >
                Browse catalog
              </Link>
            </div>

            <ul
              className="
                mt-8
                grid
                gap-3
                text-sm
                text-white/65
                lg:hidden
              "
            >
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <li
                    key={feature.title}
                    className="flex items-start gap-3"
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.8}
                      className="
                        mt-0.5
                        shrink-0
                        text-[var(--brand-400)]
                      "
                    />

                    <span>{feature.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative hidden lg:block">
            <div
              className="
                relative
                aspect-[4/3]
                overflow-hidden
                rounded-lg
                border
                border-white/10
                bg-black
              "
            >
              <img
                src="/images/importation.jpg"
                alt="Products sourced from international markets"
                className="h-full w-full object-cover opacity-90"
                loading="lazy"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/90
                  via-black/25
                  to-transparent
                "
              />

              <div
                className="
                  absolute
                  inset-x-4
                  bottom-4
                  rounded-md
                  border
                  border-white/10
                  bg-black/75
                  p-3
                  backdrop-blur-sm
                "
              >
                <ol className="space-y-2">
                  {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                      <li
                        key={feature.title}
                        className="flex items-center gap-3"
                      >
                        <span
                          className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            text-[var(--brand-300)]
                          "
                        >
                          <Icon
                            size={14}
                            strokeWidth={1.8}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">
                            {feature.title}
                          </p>

                          <p className="truncate text-[11px] text-white/45">
                            Step {index + 1}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            <div
              className="
                absolute
                -right-5
                -top-5
                rounded-md
                border
                border-white/10
                bg-[var(--surface-dark)]
                px-4
                py-3
                shadow-lg
              "
            >
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/45
                "
              >
                Sourced for you
              </p>

              <p className="mt-1 text-sm font-medium text-white">
                From source to doorstep
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
