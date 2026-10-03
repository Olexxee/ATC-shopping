import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import {
  useAdminFlexPayPlans,
  useAdminFlexPayStats,
} from "../../features/admin/flexpay/flexpay.queries";
import { FlexPayStats } from "../../components/admin/flexyPay/FlexPayStats";
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
  }).format(new Date(value));
};

export function AdminFlexPayPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const statsQuery = useAdminFlexPayStats();

  const plansQuery = useAdminFlexPayPlans({
    page,
    limit: 20,
    status: status || undefined,
    search: search.trim() || undefined,
  });

  const plans = plansQuery.data?.data ?? [];
  const meta = plansQuery.data?.meta;

  const totalPages = useMemo(
    () => meta?.totalPages ?? 1,
    [meta],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          FlexPay
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Monitor customer installment plans and payments.
        </p>
      </div>

      <FlexPayStats
        stats={statsQuery.data}
        isLoading={statsQuery.isLoading}
      />

      <div className="rounded-xl border border-[#1A1F2E] bg-[#11151C]">
        <div className="flex flex-col gap-4 border-b border-[#1A1F2E] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-medium text-white">
              FlexPay Plans
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {meta?.total ?? 0} plans
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search plans or customers..."
                className="h-10 w-full rounded-lg border border-[#1A1F2E] bg-[#0B0E13] pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#5B8CFF] sm:w-72"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-lg border border-[#1A1F2E] bg-[#0B0E13] px-3 text-sm text-white outline-none focus:border-[#5B8CFF]"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SHIPPING_DUE">
                Shipping Due
              </option>
              <option value="COMPLETED">Completed</option>
              <option value="ORDER_FAILED">
                Order Failed
              </option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-[#1A1F2E] text-xs uppercase tracking-wide text-gray-500">
                <th className="px-5 py-4">Plan</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Product Value</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Balance</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Next Due</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>

            <tbody>
              {plansQuery.isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading FlexPay plans...
                  </td>
                </tr>
              )}

              {!plansQuery.isLoading &&
                plans.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No FlexPay plans found.
                    </td>
                  </tr>
                )}

              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="border-b border-[#1A1F2E] transition hover:bg-[#151A23]"
                >
                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/flexpay/${plan.id}`}
                      className="font-medium text-[#5B8CFF] hover:underline"
                    >
                      {plan.planNumber}
                    </Link>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-white">
                      {plan.customerName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {plan.customerEmail ||
                        plan.customerPhone}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-300">
                    {money(plan.productSubtotal)}
                  </td>

                  <td className="px-5 py-4 text-sm text-green-400">
                    {money(plan.amountPaid)}
                  </td>

                  <td className="px-5 py-4 text-sm text-white">
                    {money(plan.balanceDue)}
                  </td>

                  <td className="px-5 py-4">
                    <FlexPayStatusBadge
                      status={plan.status}
                    />
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {date(plan.nextDueAt)}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-400">
                    {date(plan.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#1A1F2E] p-4">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="rounded-lg border border-[#1A1F2E] px-3 py-2 text-sm text-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="rounded-lg border border-[#1A1F2E] px-3 py-2 text-sm text-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}