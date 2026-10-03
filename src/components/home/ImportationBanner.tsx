import { ArrowRight, PackageSearch, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { Container } from "../layout/Container";
import { Section } from "../layout/Section";

/* ============================================================
 * FEATURES
 * ========================================================== */

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

/* ============================================================
 * BANNER
 * ========================================================== */

export function ImportationBanner() {
  return (
    <Section className="relative overflow-hidden bg-slate-950">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
      >
        <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-slate-800/60 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-slate-800/40 blur-3xl" />
      </div>

      <Container>
        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ------------------------------------------------------------
           * Content
           * ---------------------------------------------------------- */}

          <div className="max-w-2xl">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Global sourcing
            </span>

            {/* Heading — explicit text-white */}
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Can't find what
              <br className="hidden sm:block" /> you're looking for?
            </h2>

            {/* Body — explicit text-slate-300 (lighter than before for contrast) */}
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Send us the product name, a link, or a photo. We'll search our
              catalog first — and if it's not there, we'll source it from
              international markets and bring it to you.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/sourcing"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 hover:shadow-lg hover:shadow-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Start a sourcing request
                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-700 bg-transparent px-6 text-sm font-semibold text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-900 hover:text-white"
              >
                Browse catalog
              </Link>
            </div>

            {/* Mobile / tablet feature list */}
            <ul className="mt-8 grid gap-3 text-sm text-slate-300 lg:hidden">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <li key={feature.title} className="flex items-start gap-3">
                    <Icon
                      size={17}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <span>{feature.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ------------------------------------------------------------
           * Visual / flow panel
           * ---------------------------------------------------------- */}

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <img
                src="/images/importation.jpg"
                alt="Products sourced from international markets"
                className="h-full w-full object-cover opacity-90"
                loading="lazy"
              />

              {/* Scrim for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Steps overlay */}
              <div className="absolute inset-x-4 bottom-4 rounded-xl border border-slate-700 bg-slate-900/95 p-3 backdrop-blur-sm">
                <ol className="space-y-2">
                  {FEATURES.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                      <li
                        key={feature.title}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                          <Icon size={14} />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-white">
                            {feature.title}
                          </p>

                          <p className="truncate text-[11px] text-slate-400">
                            Step {index + 1}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-5 -right-5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 shadow-xl shadow-black/50">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
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