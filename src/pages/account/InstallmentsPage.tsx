import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  WalletCards,
} from "lucide-react";
import { InstallmentPlanCard } from "../../features/installments/components/InstallmentPlanCard";
import { useFlexPayPlans } from "../../features/installments/installments.queries";
import type { FlexPayPlan } from "../../features/installments/installments.types";

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number | string) =>
  `₦${toNumber(value).toLocaleString()}`;

const isOpenPlan = (plan: FlexPayPlan) =>
  plan.status === "ACTIVE" || plan.status === "SHIPPING_DUE";

const getNextPayment = (plans: FlexPayPlan[]) => {
  return plans
    .filter(
      (plan) =>
        isOpenPlan(plan) && plan.nextDueAt && toNumber(plan.balanceDue) > 0,
    )
    .sort(
      (a, b) =>
        new Date(a.nextDueAt!).getTime() - new Date(b.nextDueAt!).getTime(),
    )[0];
};

export default function InstallmentsPage() {
  const plansQuery = useFlexPayPlans();

  const plans = plansQuery.data?.data ?? [];

  const activePlans = plans.filter(isOpenPlan);

  const totalBalance = activePlans.reduce(
    (total, plan) => total + toNumber(plan.balanceDue),
    0,
  );

  const nextPayment = getNextPayment(activePlans);

  if (plansQuery.isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="h-7 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (plansQuery.isError) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />

            <div>
              <h1 className="font-semibold text-red-900">
                Unable to load your installments
              </h1>

              <p className="mt-1 text-sm text-red-700">
                {plansQuery.error instanceof Error
                  ? plansQuery.error.message
                  : "Something went wrong while loading your FlexPay plans."}
              </p>

              <button
                type="button"
                onClick={() => plansQuery.refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          FlexPay
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Installments
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your FlexPay purchases, payment schedules, and outstanding
          balances.
        </p>
      </div>

      {plans.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <WalletCards size={18} />
              </div>

              <p className="text-sm font-medium text-slate-600">Active plans</p>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {activePlans.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <CalendarClock size={18} />
              </div>

              <p className="text-sm font-medium text-slate-600">
                Outstanding balance
              </p>
            </div>

            <p className="mt-4 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalBalance)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 size={18} />
              </div>

              <p className="text-sm font-medium text-slate-600">Next payment</p>
            </div>

            {nextPayment ? (
              <>
                <p className="mt-4 text-2xl font-semibold text-slate-900">
                  {formatCurrency(nextPayment.balanceDue)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {new Date(nextPayment.nextDueAt!).toLocaleDateString(
                    "en-NG",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm font-medium text-slate-500">
                Nothing due
              </p>
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-8">
        {plans.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <WalletCards className="text-slate-500" size={22} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No FlexPay plans yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When you choose FlexPay during checkout, your installment plans
              will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Your plans
              </h2>

              <span className="text-sm text-slate-500">
                {plans.length} {plans.length === 1 ? "plan" : "plans"}
              </span>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => (
                <InstallmentPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
