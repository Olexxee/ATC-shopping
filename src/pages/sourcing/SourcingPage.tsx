import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SourcingRequestForm } from "../../features/sourcing/components/SourcingRequestForm";

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface InfoCardProps {
  title: string;
  description: string;
}

function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function SourcingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Search size={22} />
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Can't find what you're looking for?
              </h1>

              <Sparkles size={20} className="hidden text-slate-400 sm:block" />
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Send us the product name, a link, or a few pictures. We'll check
              our catalog and help identify the product.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <SourcingRequestForm />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard
            title="Describe it"
            description="Tell us the product name, model, color, size, or other details."
          />

          <InfoCard
            title="Add a reference"
            description="A product link or image can help us identify the exact item."
          />

          <InfoCard
            title="We'll check"
            description="We'll first look for an existing match in the Keplex catalog."
          />
        </div>
      </div>
    </main>
  );
}
