import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Package,
  Sparkles,
  User,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Container } from "../../../components/layout/Container";
import { useAdminSourcingRequest } from "../../../features/admin/sourcing/admin-sourcing.queries";
import { useUpdateAdminSourcingRequestStatus } from "../../../features/admin/sourcing/admin-sourcing.mutations";
import type {
  AdminSourcingRequest,
  AdminSourcingRequestStatus,
  AdminSourcingResponse,
  AdminSourcingResponseStatus,
} from "../../../features/admin/sourcing/admin-sourcing.types";

/* ============================================================
 * CONSTANTS
 * ========================================================== */

const REQUEST_STATUS_CLASSES: Record<AdminSourcingRequestStatus, string> = {
  SUBMITTED: "bg-blue-50 text-blue-700 ring-blue-600/10",
  IN_REVIEW: "bg-amber-50 text-amber-700 ring-amber-600/10",
  RESPONDED: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  COMPLETED: "bg-green-50 text-green-700 ring-green-600/10",
  DECLINED: "bg-red-50 text-red-700 ring-red-600/10",
  CANCELLED: "bg-neutral-100 text-neutral-600 ring-neutral-500/10",
};

const RESPONSE_STATUS_CLASSES: Record<AdminSourcingResponseStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  OFFERED: "bg-blue-50 text-blue-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  DECLINED: "bg-red-50 text-red-700",
  EXPIRED: "bg-neutral-100 text-neutral-600",
  CANCELLED: "bg-neutral-100 text-neutral-600",
};

/* ============================================================
 * HELPERS
 * ========================================================== */

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatStatusLabel(status: AdminSourcingRequestStatus): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ============================================================
 * PAGE
 * ========================================================== */

export default function AdminSourcingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const query = useAdminSourcingRequest(id);
  const updateStatus = useUpdateAdminSourcingRequestStatus();

  /* ------------------------------------------------------ */
  /* Loading                                                */
  /* ------------------------------------------------------ */

  if (query.isLoading) {
    return <AdminSourcingDetailSkeleton />;
  }

  /* ------------------------------------------------------ */
  /* Error / not found                                      */
  /* ------------------------------------------------------ */

  if (query.isError || !query.data) {
    return (
      <main className="min-h-full bg-neutral-50">
        <Container>
          <div className="py-8 sm:py-10">
            <Link
              to="/admin/sourcing"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
            >
              <ArrowLeft size={16} />
              Sourcing requests
            </Link>

            <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8">
              <h1 className="text-lg font-semibold text-neutral-950">
                Unable to load sourcing request
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                The sourcing request could not be loaded.
              </p>

              <button
                type="button"
                onClick={() => query.refetch()}
                className="mt-5 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Try again
              </button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  /* ------------------------------------------------------ */
  /* Loaded                                                 */
  /* ------------------------------------------------------ */

  const request = query.data;

  const canCreateProduct =
    request.status === "SUBMITTED" || request.status === "IN_REVIEW";

  const handleCreateProduct = () => {
    navigate(
      `/admin/products/new?sourcingId=${encodeURIComponent(request.id)}`,
    );
  };

  const handleStatusChange = (status: AdminSourcingRequestStatus) => {
    if (updateStatus.isPending) return;

    updateStatus.mutate({ id: request.id, status });
  };

  return (
    <main className="min-h-full bg-neutral-50">
      <Container>
        <div className="py-8 sm:py-10">
          <Link
            to="/admin/sourcing"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ArrowLeft size={16} />
            Sourcing requests
          </Link>

          <RequestHeader
            request={request}
            canCreateProduct={canCreateProduct}
            onCreateProduct={handleCreateProduct}
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <RequestInformation request={request} />
              <ReferenceImages request={request} />
              <AIAnalysis request={request} />
              <SourcingResponses request={request} />
            </div>

            <aside className="space-y-6">
              <CustomerCard request={request} />
              <RequestStatusCard
                request={request}
                isPending={updateStatus.isPending}
                onStatusChange={handleStatusChange}
              />
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}

/* ============================================================
 * HEADER
 * ========================================================== */

function RequestHeader({
  request,
  canCreateProduct,
  onCreateProduct,
}: {
  request: AdminSourcingRequest;
  canCreateProduct: boolean;
  onCreateProduct: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {request.requestNumber}
          </span>

          <StatusBadge status={request.status} />
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {request.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} />
            {formatDate(request.createdAt)}
          </span>

          <span>
            {request.responses.length}{" "}
            {request.responses.length === 1 ? "response" : "responses"}
          </span>
        </div>
      </div>

      {canCreateProduct && (
        <button
          type="button"
          onClick={onCreateProduct}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          <Package size={16} />
          Create sourced product
        </button>
      )}
    </div>
  );
}

/* ============================================================
 * STATUS BADGE
 * ========================================================== */

function StatusBadge({ status }: { status: AdminSourcingRequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${REQUEST_STATUS_CLASSES[status]}`}
    >
      {formatStatusLabel(status)}
    </span>
  );
}

/* ============================================================
 * REQUEST INFORMATION
 * ========================================================== */

function RequestInformation({ request }: { request: AdminSourcingRequest }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <SectionHeader title="Request information" />

      <div className="space-y-6 p-6">
        {request.description ? (
          <div>
            <FieldLabel>Description</FieldLabel>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
              {request.description}
            </p>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">
            No additional description was provided.
          </p>
        )}

        {request.referenceUrl && (
          <div>
            <FieldLabel>Reference URL</FieldLabel>

            <a
              href={request.referenceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex max-w-full items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <span className="truncate">{request.referenceUrl}</span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="Submitted" value={formatDate(request.createdAt)} />
          <InfoItem
            label="Last updated"
            value={formatDate(request.updatedAt)}
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
 * REFERENCE IMAGES
 * ========================================================== */

function ReferenceImages({ request }: { request: AdminSourcingRequest }) {
  if (request.referenceImages.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <SectionHeader
        title="Reference images"
        description="Images supplied by the customer for identification."
      />

      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 lg:grid-cols-4">
        {request.referenceImages.map((image) => (
          <a
            key={image.publicId}
            href={image.url}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={image.url}
                alt="Sourcing reference"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * AI ANALYSIS
 * ========================================================== */

function AIAnalysis({ request }: { request: AdminSourcingRequest }) {
  const analysis = request.aiAnalysis;

  if (!analysis) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <SectionHeader
          icon={<Sparkles size={17} />}
          title="AI analysis"
          description="No AI analysis is available for this request."
        />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <SectionHeader
        icon={<Sparkles size={17} />}
        title="AI analysis"
        description="Identification data generated from the customer's request."
      />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem label="Product type" value={analysis.productType || "—"} />
          <InfoItem label="Brand" value={analysis.brand || "—"} />
          <InfoItem
            label="Possible model"
            value={analysis.possibleModel || "—"}
          />
          <InfoItem label="Category" value={analysis.category || "—"} />
        </div>

        <ConfidenceBar value={analysis.confidence} />

        {analysis.searchTerms.length > 0 && (
          <div>
            <FieldLabel>Search terms</FieldLabel>

            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.searchTerms.map((term) => (
                <span
                  key={term}
                  className="rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}

        {Object.keys(analysis.attributes).length > 0 && (
          <div>
            <FieldLabel>Attributes</FieldLabel>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Object.entries(analysis.attributes).map(([key, value]) => (
                <div key={key} className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs font-medium text-neutral-400">{key}</p>

                  <p className="mt-1 text-sm font-medium text-neutral-800">
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const percent = Math.min(Math.max(value * 100, 0), 100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <FieldLabel>Confidence</FieldLabel>

        <span className="text-sm font-semibold text-neutral-950">
          {formatConfidence(value)}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-950 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
 * SOURCING RESPONSES
 * ========================================================== */

function SourcingResponses({ request }: { request: AdminSourcingRequest }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <SectionHeader
        title="Sourcing responses"
        description="Products and responses created for this request."
      />

      {request.responses.length === 0 ? (
        <div className="p-8 text-center">
          <Package size={24} className="mx-auto text-neutral-300" />

          <p className="mt-3 text-sm font-medium text-neutral-700">
            No response yet
          </p>

          <p className="mt-1 text-sm text-neutral-400">
            Create a sourced product to respond to this request.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          {request.responses.map((response) => (
            <SourcingResponseCard key={response.id} response={response} />
          ))}
        </div>
      )}
    </section>
  );
}

function SourcingResponseCard({
  response,
}: {
  response: AdminSourcingResponse;
}) {
  const product = response.product;
  const variant = response.variant;

  const primaryMedia =
    variant?.media.find((media) => media.isPrimary) ??
    variant?.media[0] ??
    product?.variants
      .flatMap((item) => item.media)
      .find((media) => media.isPrimary);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {primaryMedia ? (
            <img
              src={primaryMedia.url}
              alt={product?.name ?? "Sourced product"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-300">
              <ImageIcon size={22} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${RESPONSE_STATUS_CLASSES[response.status]}`}
            >
              {response.status}
            </span>

            <span className="text-xs text-neutral-400">
              {formatDate(response.createdAt)}
            </span>
          </div>

          {product ? (
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="mt-2 inline-flex items-center gap-2 text-base font-semibold text-neutral-950 hover:underline"
            >
              {product.name}
              <ExternalLink size={14} />
            </Link>
          ) : (
            <p className="mt-2 text-base font-semibold text-neutral-950">
              Product unavailable
            </p>
          )}

          {variant && (
            <p className="mt-1 text-sm text-neutral-500">
              {variant.sku || "No SKU"} · ₦
              {variant.price.toLocaleString("en-NG")}
              {" · "}
              {variant.stock} in stock
            </p>
          )}

          {response.message && (
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {response.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * CUSTOMER
 * ========================================================== */

function CustomerCard({ request }: { request: AdminSourcingRequest }) {
  const user = request.user;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <User size={18} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-950">Customer</h2>
          <p className="text-xs text-neutral-400">Request owner</p>
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-sm font-medium text-neutral-900">
          {user?.fullName || "Unnamed customer"}
        </p>

        {user?.email && (
          <p className="break-all text-sm text-neutral-500">{user.email}</p>
        )}

        {user?.phone && (
          <p className="text-sm text-neutral-500">{user.phone}</p>
        )}
      </div>
    </section>
  );
}

/* ============================================================
 * REQUEST STATUS
 * ========================================================== */

function RequestStatusCard({
  request,
  isPending,
  onStatusChange,
}: {
  request: AdminSourcingRequest;
  isPending: boolean;
  onStatusChange: (status: AdminSourcingRequestStatus) => void;
}) {
  const canReview = request.status === "SUBMITTED";

  const canDecline =
    request.status === "SUBMITTED" || request.status === "IN_REVIEW";

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-950">Request status</h2>

      <div className="mt-4">
        <StatusBadge status={request.status} />
      </div>

      {(canReview || canDecline) && (
        <div className="mt-5 space-y-2">
          {canReview && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onStatusChange("IN_REVIEW")}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 size={16} />
              Mark in review
            </button>
          )}

          {canDecline && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => onStatusChange("DECLINED")}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Decline request
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/* ============================================================
 * SHARED PRIMITIVES
 * ========================================================== */

function SectionHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 px-6 py-5">
      {icon && (
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
          {icon}
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold text-neutral-950">{title}</h2>

        {description && (
          <p className="mt-0.5 text-sm text-neutral-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </p>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>

      <p className="mt-1 text-sm font-medium text-neutral-800">{value}</p>
    </div>
  );
}

/* ============================================================
 * SKELETON
 * ========================================================== */

function AdminSourcingDetailSkeleton() {
  return (
    <main className="min-h-full bg-neutral-50">
      <Container>
        <div className="animate-pulse py-8 sm:py-10">
          <div className="h-5 w-36 rounded bg-neutral-200" />

          <div className="mt-8">
            <div className="h-4 w-28 rounded bg-neutral-200" />
            <div className="mt-3 h-9 w-96 max-w-full rounded bg-neutral-200" />
            <div className="mt-3 h-4 w-64 rounded bg-neutral-200" />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>

            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="h-5 w-40 rounded bg-neutral-200" />
      <div className="mt-5 h-4 w-full rounded bg-neutral-100" />
      <div className="mt-3 h-4 w-4/5 rounded bg-neutral-100" />
      <div className="mt-3 h-4 w-3/5 rounded bg-neutral-100" />
    </div>
  );
}
