import { Check, Circle, Clock3 } from "lucide-react";
import type { FlexPayInstallment } from "../installments.types";

interface InstallmentScheduleProps {
  installments: FlexPayInstallment[];
}

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCurrency = (value: number | string) =>
  `₦${toNumber(value).toLocaleString()}`;

const formatDate = (value: string) => {
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

export function InstallmentSchedule({
  installments,
}: InstallmentScheduleProps) {
  if (installments.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
        No installment schedule is available yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="font-semibold text-slate-900">Payment schedule</h2>

        <p className="mt-1 text-sm text-slate-500">
          Your scheduled FlexPay payments.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {installments.map((installment) => {
          const isPaid = installment.status === "PAID";
          const isPartial = installment.status === "PARTIALLY_PAID";
          const isPending = installment.status === "PENDING";

          return (
            <div key={installment.id} className="flex gap-4 px-5 py-5 sm:px-6">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    isPaid
                      ? "bg-emerald-100 text-emerald-600"
                      : isPartial
                        ? "bg-amber-100 text-amber-600"
                        : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  {isPaid ? (
                    <Check size={16} />
                  ) : isPartial ? (
                    <Clock3 size={16} />
                  ) : (
                    <Circle size={13} />
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Payment {installment.sequence}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Due {formatDate(installment.dueDate)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(installment.amount)}
                    </p>

                    {isPaid ? (
                      <p className="mt-1 text-xs font-medium text-emerald-600">
                        Paid
                      </p>
                    ) : isPartial ? (
                      <p className="mt-1 text-xs font-medium text-amber-600">
                        {formatCurrency(installment.amountPaid)} paid
                      </p>
                    ) : isPending ? (
                      <p className="mt-1 text-xs text-slate-500">Upcoming</p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-500">
                        {installment.status}
                      </p>
                    )}
                  </div>
                </div>

                {isPartial ? (
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (toNumber(installment.amountPaid) /
                              Math.max(toNumber(installment.amount), 1)) *
                              100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
