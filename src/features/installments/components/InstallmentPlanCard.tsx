import { ArrowRight, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import type { FlexPayPlan } from "../installments.types";
import { InstallmentProgress } from "./InstallmentProgress";
import { InstallmentStatusBadge } from "./InstallmentStatusBadge";

interface InstallmentPlanCardProps {
  plan: FlexPayPlan;
}

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number | string) =>
  `₦${toNumber(value).toLocaleString()}`;

const formatDate = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function InstallmentPlanCard({ plan }: InstallmentPlanCardProps) {
  const nextDueDate = formatDate(plan.nextDueAt);
  const balanceDue = toNumber(plan.balanceDue);

  const itemPreview = plan.items
    .slice(0, 2)
    .map((item) => item.productName)
    .join(", ");

  const remainingItems = Math.max(plan.items.length - 2, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            FlexPay
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              {plan.planNumber}
            </h2>

            <InstallmentStatusBadge status={plan.status} />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {itemPreview || "FlexPay purchase"}

            {remainingItems > 0 ? ` + ${remainingItems} more` : ""}
          </p>
        </div>

        <Link
          to={`/account/installments/${encodeURIComponent(plan.id)}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          View plan
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-6">
        <InstallmentProgress
          amountPaid={plan.amountPaid}
          totalAmount={plan.totalAmount}
        />
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Total</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCurrency(plan.totalAmount)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Paid</p>
          <p className="mt-1 text-sm font-semibold text-emerald-600">
            {formatCurrency(plan.amountPaid)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatCurrency(balanceDue)}
          </p>
        </div>
      </div>

      {plan.status === "ACTIVE" && nextDueDate && balanceDue > 0 ? (
        <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 px-3.5 py-3 text-sm text-slate-600">
          <CalendarClock size={16} className="shrink-0 text-slate-400" />
          <span>
            Next payment due{" "}
            <strong className="text-slate-900">{nextDueDate}</strong>
          </span>
        </div>
      ) : null}

      {plan.status === "SHIPPING_DUE" ? (
        <div className="mt-5 rounded-lg bg-amber-50 px-3.5 py-3 text-sm text-amber-800">
          Your product balance is complete. Shipping payment is now required.
        </div>
      ) : null}

      {plan.status === "COMPLETED" ? (
        <div className="mt-5 rounded-lg bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">
          This FlexPay plan has been fully completed.
        </div>
      ) : null}
    </div>
  );
}
