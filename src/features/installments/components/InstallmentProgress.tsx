interface InstallmentProgressProps {
  amountPaid: number | string;
  totalAmount: number | string;
}

const toNumber = (value: number | string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function InstallmentProgress({
  amountPaid,
  totalAmount,
}: InstallmentProgressProps) {
  const paid = toNumber(amountPaid);
  const total = toNumber(totalAmount);

  const percentage =
    total > 0 ? Math.min(100, Math.max(0, (paid / total) * 100)) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs">
        <span className="text-slate-500">{percentage.toFixed(0)}% paid</span>

        <span className="font-medium text-slate-700">
          ₦{paid.toLocaleString()} of ₦{total.toLocaleString()}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-full rounded-full bg-slate-900 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
