import { ArrowLeft, CalendarDays, Package, WalletCards } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { InstallmentPaymentForm } from "../../features/installments/components/InstallmentPaymentForm";
import { InstallmentProgress } from "../../features/installments/components/InstallmentProgress";
import { InstallmentSchedule } from "../../features/installments/components/InstallmentSchedule";
import { InstallmentStatusBadge } from "../../features/installments/components/InstallmentStatusBadge";
import { useFlexPayPlan } from "../../features/installments/installments.queries";

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number | string) =>
  `₦${toNumber(value).toLocaleString()}`;

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function InstallmentDetailPage() {
  const { planId } = useParams<{ planId: string }>();

  const planQuery = useFlexPayPlan(planId ?? "");

  if (!planId) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Invalid FlexPay plan.
        </div>
      </div>
    );
  }

  if (planQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />

        <div className="mt-6 h-56 animate-pulse rounded-2xl bg-slate-100" />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (planQuery.isError || !planQuery.data?.data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Link
          to="/account/installments"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to installments
        </Link>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="font-semibold text-red-900">
            Unable to load this plan
          </h1>

          <p className="mt-1 text-sm text-red-700">
            {planQuery.error instanceof Error
              ? planQuery.error.message
              : "The FlexPay plan could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const plan = planQuery.data.data;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/account/installments"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to installments
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              FlexPay plan
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-semibold text-slate-900">
                {plan.planNumber}
              </h1>

              <InstallmentStatusBadge status={plan.status} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Started {formatDate(plan.createdAt)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-left sm:text-right">
            <p className="text-xs text-slate-500">Remaining</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {formatCurrency(plan.balanceDue)}
            </p>
          </div>
        </div>

        <div className="mt-7">
          <InstallmentProgress
            amountPaid={plan.amountPaid}
            totalAmount={plan.totalAmount}
          />
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
          <div className="flex gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <WalletCards size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatCurrency(plan.totalAmount)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <WalletCards size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Paid</p>
              <p className="mt-1 text-sm font-semibold text-emerald-600">
                {formatCurrency(plan.amountPaid)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <CalendarDays size={17} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Next due</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {formatDate(plan.nextDueAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-slate-500" />

                <h2 className="font-semibold text-slate-900">Purchase</h2>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {plan.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 px-5 py-4 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {item.productName}
                    </p>

                    {item.variantLabel ? (
                      <p className="mt-1 text-xs text-slate-500">
                        {item.variantLabel}
                      </p>
                    ) : null}

                    <p className="mt-1 text-xs text-slate-400">
                      {item.sku} · Qty {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Product subtotal</span>

                <span className="font-medium text-slate-900">
                  {formatCurrency(plan.productSubtotal)}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Shipping</span>

                <span className="font-medium text-slate-900">
                  {plan.status === "SHIPPING_DUE"
                    ? formatCurrency(plan.shippingCost)
                    : toNumber(plan.shippingCost) > 0
                      ? formatCurrency(plan.shippingCost)
                      : "Pending"}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4 border-t border-slate-100 pt-3">
                <span className="font-semibold text-slate-900">Total</span>

                <span className="font-semibold text-slate-900">
                  {formatCurrency(plan.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <InstallmentSchedule installments={plan.installments} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          {plan.status === "ACTIVE" ? (
            <InstallmentPaymentForm plan={plan} />
          ) : plan.status === "SHIPPING_DUE" ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">
                Shipping payment required
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                Your product balance is complete. Once the final shipping amount
                is available, you can complete the shipping payment.
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-amber-200 pt-4">
                <span className="text-sm text-amber-700">Shipping</span>

                <span className="font-semibold text-amber-900">
                  {formatCurrency(plan.shippingCost)}
                </span>
              </div>
            </div>
          ) : plan.status === "COMPLETED" ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="font-semibold text-emerald-900">
                FlexPay completed
              </h2>

              <p className="mt-2 text-sm leading-6 text-emerald-700">
                This plan has been fully paid.
              </p>

              {plan.completedAt ? (
                <p className="mt-3 text-xs text-emerald-600">
                  Completed {formatDate(plan.completedAt)}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                {plan.status === "CANCELLED"
                  ? "Plan cancelled"
                  : plan.status === "EXPIRED"
                    ? "Plan expired"
                    : "Plan requires attention"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                This FlexPay plan is currently {plan.status.toLowerCase()}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
