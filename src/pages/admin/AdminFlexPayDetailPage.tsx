import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Ban } from "lucide-react";
import {
  useAdminFlexPayPayments,
  useAdminFlexPayPlan,
} from "../../features/admin/flexpay/flexpay.queries";
import { useCancelAdminFlexPayPlan } from "../../features/admin/flexpay/flexpay.mutations";

import { FlexPayStatusBadge } from "../../components/admin/flexyPay/FlexPayStatusBadge";

const money = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);

const date = (value: string | null) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export function AdminFlexPayDetailPage() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const planQuery = useAdminFlexPayPlan(planId);

  const paymentsQuery = useAdminFlexPayPayments(planId);

  const cancelMutation = useCancelAdminFlexPayPlan();

  const plan = planQuery.data;

  const handleCancel = async () => {
    if (!plan) return;

    const confirmed = window.confirm(`Cancel FlexPay plan ${plan.planNumber}?`);

    if (!confirmed) return;

    await cancelMutation.mutateAsync(plan.id);

    await planQuery.refetch();
  };

  if (planQuery.isLoading) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading FlexPay plan...
      </div>
    );
  }

  if (planQuery.isError || !plan) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/flexpay"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to FlexPay
        </Link>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-400">
          FlexPay plan could not be loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Link
            to="/admin/flexpay"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to FlexPay
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">
              {plan.planNumber}
            </h1>

            <FlexPayStatusBadge status={plan.status} />
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Created {date(plan.createdAt)}
          </p>
        </div>

        {(plan.status === "ACTIVE" || plan.status === "SHIPPING_DUE") && (
          <button
            type="button"
            disabled={cancelMutation.isPending}
            onClick={handleCancel}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
          >
            <Ban className="h-4 w-4" />

            {cancelMutation.isPending ? "Cancelling..." : "Cancel Plan"}
          </button>
        )}
      </div>

      {/* Financial summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="Product Value"
          value={money(plan.productSubtotal)}
        />

        <SummaryCard label="Shipping" value={money(plan.shippingCost)} />

        <SummaryCard label="Total" value={money(plan.totalAmount)} />

        <SummaryCard label="Paid" value={money(plan.amountPaid)} />

        <SummaryCard label="Balance" value={money(plan.balanceDue)} />
      </div>

      {/* Customer */}

      <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <SectionHeader title="Customer" />

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
          <Info label="Name" value={plan.customerName} />

          <Info label="Email" value={plan.customerEmail || "—"} />

          <Info label="Phone" value={plan.customerPhone} />
        </div>
      </section>

      {/* Shipping */}

      <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <SectionHeader title="Shipping Address" />

        <div className="p-5">
          <p className="text-sm leading-6 text-gray-300">
            {plan.shippingLabel && (
              <>
                <span className="font-medium text-white">
                  {plan.shippingLabel}
                </span>
                <br />
              </>
            )}

            {plan.shippingStreet}
            <br />

            {plan.shippingCity}
            {plan.shippingState ? `, ${plan.shippingState}` : ""}
            <br />

            {plan.shippingCountry}
          </p>
        </div>
      </section>

      {/* Items */}

      <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <SectionHeader title="Locked Plan Items" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-[#1A1F2E] text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Qty</th>
                <th className="px-5 py-4">Unit Price</th>
                <th className="px-5 py-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {plan.items.map((item) => (
                <tr key={item.id} className="border-b border-[#1A1F2E]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{item.productName}</p>

                    {item.variantLabel && (
                      <p className="mt-1 text-xs text-gray-500">
                        {item.variantLabel}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {item.sku}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {item.quantity}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {money(item.unitPrice)}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-white">
                    {money(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Schedule */}

      <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <SectionHeader title="Installment Schedule" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-[#1A1F2E] text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">#</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Balance</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {plan.installments.map((installment) => (
                <tr key={installment.id} className="border-b border-[#1A1F2E]">
                  <td className="px-5 py-4 text-sm text-gray-300">
                    {installment.sequence}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {date(installment.dueDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-white">
                    {money(installment.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-green-400">
                    {money(installment.amountPaid)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {money(
                      Math.max(0, installment.amount - installment.amountPaid),
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <InstallmentStatus status={installment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payments */}

      <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <SectionHeader title="Payment History" />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="border-b border-[#1A1F2E] text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>

            <tbody>
              {paymentsQuery.data?.map((payment) => (
                <tr key={payment.id} className="border-b border-[#1A1F2E]">
                  <td className="px-5 py-4 font-mono text-xs text-gray-300">
                    {payment.reference}
                  </td>

                  <td className="px-5 py-4 text-sm text-white">
                    {money(payment.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {payment.provider}
                  </td>

                  <td className="px-5 py-4">
                    <PaymentStatus status={payment.status} />
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {date(payment.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paymentsQuery.isLoading && (
          <div className="p-6 text-center text-sm text-gray-500">
            Loading payments...
          </div>
        )}

        {!paymentsQuery.isLoading && paymentsQuery.data?.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No payments recorded.
          </div>
        )}
      </section>

      {/* Order */}

      {plan.order && (
        <section className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
          <SectionHeader title="Order" />

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-white">{plan.order.orderNumber}</p>

              <p className="mt-1 text-sm text-gray-500">{plan.order.status}</p>
            </div>

            <Link
              to={`/admin/orders/${plan.order.id}`}
              className="rounded-lg border border-[#1A1F2E] px-4 py-2 text-sm text-gray-300 hover:bg-[#1A1F2E]"
            >
              View Order
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#1A1F2E] bg-[#11151C] p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-[#1A1F2E] px-5 py-4">
      <h2 className="font-medium text-white">{title}</h2>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>

      <p className="mt-1 text-sm text-gray-200">{value}</p>
    </div>
  );
}

function InstallmentStatus({ status }: { status: string }) {
  const classes =
    status === "PAID"
      ? "bg-green-500/10 text-green-400"
      : status === "OVERDUE"
        ? "bg-red-500/10 text-red-400"
        : "bg-gray-500/10 text-gray-400";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${classes}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function PaymentStatus({ status }: { status: string }) {
  const classes =
    status === "SUCCESS"
      ? "bg-green-500/10 text-green-400"
      : status === "FAILED" || status === "REVERSED"
        ? "bg-red-500/10 text-red-400"
        : "bg-amber-500/10 text-amber-400";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${classes}`}>
      {status}
    </span>
  );
}
