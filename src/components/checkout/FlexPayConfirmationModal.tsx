import { CalendarDays, Check, X } from "lucide-react";

import type { FlexPayCalculation } from "../../features/checkout/checkout.flexpay";

interface FlexPayConfirmationModalProps {
  calculation: FlexPayCalculation;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

const formatCurrency = (value: number) => {
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function FlexPayConfirmationModal({
  calculation,
  onCancel,
  onConfirm,
  isSubmitting = false,
}: FlexPayConfirmationModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flexpay-confirmation-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <CalendarDays className="h-5 w-5 text-gray-700" />
            </div>

            <div>
              <h2
                id="flexpay-confirmation-title"
                className="text-lg font-semibold text-gray-900"
              >
                Confirm your FlexPay plan
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your payment schedule before continuing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="space-y-6 px-5 py-6 sm:px-6">
          {/* SUMMARY */}

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Product total</span>

              <span className="font-semibold text-gray-900">
                {formatCurrency(calculation.subtotal)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Payment schedule</span>

              <span className="text-sm font-semibold text-gray-900">
                {calculation.installmentCount} payments
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Frequency</span>

              <span className="text-sm font-semibold text-gray-900">
                Every {calculation.installmentIntervalDays} days
              </span>
            </div>
          </div>

          {/* PAYMENT SCHEDULE */}

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Payment schedule
            </h3>

            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
              {calculation.installments.map((installment) => {
                const isFirst = installment.sequence === 1;

                return (
                  <div
                    key={installment.sequence}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isFirst
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {installment.sequence}
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Payment {installment.sequence}
                        </p>

                        <p className="text-xs text-gray-500">
                          {isFirst
                            ? "Due today"
                            : formatDate(installment.dueDate)}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-gray-900">
                      {formatCurrency(installment.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FIRST PAYMENT */}

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">Pay today</span>

              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(calculation.firstPaymentAmount)}
              </span>
            </div>
          </div>

          {/* TERMS */}

          <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-700" />

            <p className="text-xs leading-5 text-gray-500">
              Your product prices will be locked when the FlexPay plan is
              created. Shipping will be calculated separately after the product
              balance has been fully paid.
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Preparing payment..."
              : `Pay ${formatCurrency(calculation.firstPaymentAmount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
