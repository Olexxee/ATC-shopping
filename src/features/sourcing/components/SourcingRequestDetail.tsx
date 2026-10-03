import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Image as ImageIcon,
  PackageSearch,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type {
  SourcingRequest,
  SourcingRequestStatus,
  SourcingResponse,
} from "../sourcing.types";
import type { Key } from "react";

const REQUEST_STATUS: Record<
  SourcingRequestStatus,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  SUBMITTED: {
    label: "Submitted",
    description: "Your request has been received.",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    icon: Clock3,
  },
  IN_REVIEW: {
    label: "In review",
    description: "We're reviewing your request.",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Clock3,
  },
  RESPONDED: {
    label: "Product found",
    description: "A product has been sourced for your request.",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  COMPLETED: {
    label: "Completed",
    description: "This sourcing request has been completed.",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    description: "We could not fulfill this sourcing request.",
    className: "bg-red-50 text-red-700 ring-red-200",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This sourcing request has been cancelled.",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    icon: XCircle,
  },
};

const RESPONSE_STATUS_STYLES: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  OFFERED: {
    label: "Available",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  ACCEPTED: {
    label: "Available",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function SourcingRequestDetail({
  request,
}: {
  request: SourcingRequest;
}) {
  const status = REQUEST_STATUS[request.status];
  const StatusIcon = status.icon;

  const activeResponses: SourcingResponse[] = request.responses.filter(
    (response: { product: any; status: string; }): response is SourcingResponse =>
      !!response.product &&
      ["PENDING", "OFFERED", "ACCEPTED"].includes(response.status),
  );

  return (
    <div className="space-y-6">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sourcing request
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {request.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Request #{request.requestNumber}
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}
          >
            <StatusIcon size={14} />
            {status.label}
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">{status.description}</p>
        </div>
      </section>

      {/* ============================================================
          REQUEST DETAILS
      ============================================================ */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Request details
        </h2>

        {request.description && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {request.description}
            </p>
          </div>
        )}

        {request.referenceUrl && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Reference link
            </p>

            <a
              href={request.referenceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex max-w-full items-center gap-2 truncate text-sm font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700"
            >
              <span className="truncate">{request.referenceUrl}</span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          </div>
        )}

        {request.referenceImages.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <ImageIcon size={15} className="text-slate-400" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Reference images
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {request.referenceImages.map(
                (image: {
                  publicId: Key | null | undefined;
                  url: string | undefined;
                }) => (
                  <a
                    key={image.publicId}
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={image.url}
                      alt="Sourcing reference"
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                  </a>
                ),
              )}
            </div>
          </div>
        )}

        <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Submitted
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(request.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Last updated
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(request.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SOURCED PRODUCTS
      ============================================================ */}

      {activeResponses.length > 0 && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <PackageSearch size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Product found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                We found a product for your sourcing request.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {activeResponses.map((response: SourcingResponse) => (
              <SourcingProductResponse key={response.id} response={response} />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================
          WAITING STATE
      ============================================================ */}

      {activeResponses.length === 0 &&
        ["SUBMITTED", "IN_REVIEW"].includes(request.status) && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Clock3 size={20} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  We're checking it
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  We've received your request. We'll check the catalog and work
                  on finding the product for you.
                </p>
              </div>
            </div>
          </section>
        )}

      {/* ============================================================
          DECLINED
      ============================================================ */}

      {request.status === "DECLINED" && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />

            <div>
              <h2 className="text-base font-semibold text-red-900">
                We couldn't source this product
              </h2>

              <p className="mt-1 text-sm leading-6 text-red-700">
                This request has been declined. You can submit another request
                if you have additional information or a different product.
              </p>

              <Link
                to="/sourcing"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
              >
                Submit another request
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SourcingProductResponse({
  response,
}: {
  response: SourcingResponse;
}) {
  const product = response.product;

  if (!product) {
    return null;
  }

  const variant = response.variant;

  const image =
    variant?.media.find((item: { isPrimary: any; }) => item.isPrimary)?.url ??
    variant?.media[0]?.url ??
    product.variants
      .flatMap((item: { media: any; }) => item.media)
      .find((item: { isPrimary: any; }) => item.isPrimary)?.url ??
    product.variants.flatMap((item: { media: any; }) => item.media)[0]?.url ??
    null;

  const responseStatus =
    RESPONSE_STATUS_STYLES[response.status] ??
    RESPONSE_STATUS_STYLES.PENDING;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex flex-col sm:flex-row">
        <div className="aspect-square w-full shrink-0 bg-slate-50 sm:w-44">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <PackageSearch size={32} />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-5">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>

                {(product.brand || product.category) && (
                  <p className="mt-1 text-sm text-slate-500">
                    {[product.brand?.name, product.category?.name]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${responseStatus.className}`}
              >
                {responseStatus.label}
              </span>
            </div>

            {variant && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Price</span>
                  <p className="font-semibold text-slate-900">
                    {formatPrice(variant.price)}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400">Stock</span>
                  <p className="font-medium text-slate-700">
                    {variant.stock > 0 ? "Available" : "Out of stock"}
                  </p>
                </div>
              </div>
            )}

            {response.message && (
              <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-sm leading-5 text-slate-600">
                  {response.message}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <Link
              to={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View product
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}
