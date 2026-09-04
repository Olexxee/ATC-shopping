import { ArrowRight } from "lucide-react";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";

export function ImportationBanner() {
  return (
    <Section className="bg-neutral-950 text-white">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          {/* Content */}
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Global sourcing
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Can't find what you're looking for?
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg">
              Tell us what you need. We can help source products from
              international markets and bring them to you.
            </p>

            <a
              href="/importation"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              Start importing
              <ArrowRight size={17} />
            </a>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800">
              <img
                src="/images/importation.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                International sourcing
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
