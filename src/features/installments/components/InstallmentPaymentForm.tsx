import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useInitializeFlexPayPayment } from "../installments.mutations";
import type { FlexPayPlan } from "../installments.types";

interface InstallmentPaymentFormProps {
  plan: FlexPayPlan;
}

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number | string) =>
  `₦${toNumber(value).toLocaleString()}`;

export function InstallmentPaymentForm({ plan }: InstallmentPaymentFormProps) {
  const initializePayment = useInitializeFlexPayPayment();

  const balanceDue = toNumber(plan.balanceDue);

  const nextInstallment = useMemo(
    () =>
      plan.installments.find(
        (installment) =>
          installment.status === "PENDING" ||
          installment.status === "PARTIALLY_PAID",
      ),
    [plan.installments],
  );

  const scheduledAmount = nextInstallment
    ? Math.max(
        toNumber(nextInstallment.amount) - toNumber(nextInstallment.amountPaid),
        0,
      )
    : balanceDue;

  const [amount, setAmount] = useState(
    scheduledAmount > 0 ? String(scheduledAmount) : "",
  );

  useEffect(() => {
    setAmount(scheduledAmount > 0 ? String(scheduledAmount) : "");
  }, [scheduledAmount]);

  const numericAmount = Number(amount);

  const isValid =
    Number.isFinite(numericAmount) &&
    numericAmount > 0 &&
    numericAmount <= balanceDue;

  const isFullSettlement = isValid && numericAmount === balanceDue;

  const handlePayment = async () => {
    if (!isValid || initializePayment.isPending) {
      return;
    }

    const response = await initializePayment.mutateAsync({
      planId: plan.id,
      payload: {
        amount: numericAmount,
      },
    });
    console.log("[FLEXPAY] Payment initialization:", response.data);

    const authorizationUrl = response.data.authorizationUrl;

    if (!authorizationUrl) {
      throw new Error("Paystack authorization URL was not returned.");
    }

    console.log("[FLEXPAY] Redirecting to:", authorizationUrl);

    window.location.assign(authorizationUrl);
  };

  if (balanceDue <= 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-900">
          Product balance fully paid
        </p>

        <p className="mt-1 text-sm text-emerald-700">
          There is no outstanding product payment on this plan.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <h2 className="font-semibold text-slate-900">Make a payment</h2>

        <p className="mt-1 text-sm text-slate-500">
          Pay your scheduled amount or pay extra to settle the plan sooner.
        </p>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500">Balance remaining</span>

          <span className="text-sm font-semibold text-slate-900">
            {formatCurrency(balanceDue)}
          </span>
        </div>

        {scheduledAmount > 0 && scheduledAmount < balanceDue ? (
          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">Scheduled payment</span>

            <span className="text-sm font-medium text-slate-700">
              {formatCurrency(scheduledAmount)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <label
          htmlFor="flexpay-payment-amount"
          className="block text-sm font-medium text-slate-700"
        >
          Payment amount
        </label>

        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-medium text-slate-500">
            ₦
          </span>

          <input
            id="flexpay-payment-amount"
            type="number"
            min="1"
            max={balanceDue}
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            placeholder="Enter amount"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {scheduledAmount > 0 && scheduledAmount <= balanceDue ? (
            <button
              type="button"
              onClick={() => setAmount(String(scheduledAmount))}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Scheduled · {formatCurrency(scheduledAmount)}
            </button>
          ) : null}

          {balanceDue > scheduledAmount ? (
            <button
              type="button"
              onClick={() => setAmount(String(balanceDue))}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Pay balance · {formatCurrency(balanceDue)}
            </button>
          ) : null}
        </div>

        {numericAmount > balanceDue ? (
          <p className="mt-2 text-xs text-red-600">
            Payment cannot exceed your remaining balance.
          </p>
        ) : null}

        {numericAmount <= 0 && amount !== "" ? (
          <p className="mt-2 text-xs text-red-600">
            Enter a valid payment amount.
          </p>
        ) : null}
      </div>

      {initializePayment.isError ? (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {initializePayment.error instanceof Error
            ? initializePayment.error.message
            : "Unable to initialize the payment."}
        </div>
      ) : null}

      <button
        type="button"
        disabled={!isValid || initializePayment.isPending}
        onClick={handlePayment}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {initializePayment.isPending ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Preparing payment...
          </>
        ) : (
          <>
            {isFullSettlement
              ? `Pay ${formatCurrency(balanceDue)}`
              : `Pay ${formatCurrency(numericAmount || 0)}`}
            <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        You will be redirected to Paystack to complete your payment.
      </p>
    </div>
  );
}
