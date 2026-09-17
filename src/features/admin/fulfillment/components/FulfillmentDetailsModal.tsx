import { X } from "lucide-react";
import type { Fulfillment } from "../fulfillment.types";

interface FulfillmentDetailsModalProps {
  fulfillment: Fulfillment;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function FulfillmentDetailsModal({
  fulfillment,
  onClose,
}: FulfillmentDetailsModalProps) {
  const total = fulfillment.items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Fulfillment details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {fulfillment.order.orderNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close fulfillment details"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fulfillment status
              </p>

              <p className="mt-2 text-base font-bold text-slate-900">
                {fulfillment.status}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fulfillment type
              </p>

              <p className="mt-2 text-base font-bold text-slate-900">
                {fulfillment.type}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Customer
            </h3>

            <div className="rounded-xl border border-slate-200 p-4 text-sm">
              <p className="font-semibold text-slate-900">
                {fulfillment.order.customerName}
              </p>

              <p className="mt-1 text-slate-600">
                {fulfillment.order.customerEmail}
              </p>

              {fulfillment.order.customerPhone && (
                <p className="mt-1 text-slate-600">
                  {fulfillment.order.customerPhone}
                </p>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Warehouse
            </h3>

            <div className="rounded-xl border border-slate-200 p-4 text-sm">
              {fulfillment.warehouse ? (
                <>
                  <p className="font-semibold text-slate-900">
                    {fulfillment.warehouse.name}
                  </p>

                  <p className="mt-1 text-slate-600">
                    Code: {fulfillment.warehouse.code}
                  </p>

                  <p className="mt-1 text-slate-600">
                    {[
                      fulfillment.warehouse.city,
                      fulfillment.warehouse.state,
                      fulfillment.warehouse.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No location provided"}
                  </p>
                </>
              ) : (
                <p className="text-slate-500">No warehouse assigned.</p>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Items
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="divide-y divide-slate-100">
                {fulfillment.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 p-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.variant.product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        SKU: {item.variant.sku}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
                      {formatCurrency(item.quantity * Number(item.unitPrice))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">
                  Fulfillment subtotal
                </span>

                <span className="font-bold text-slate-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Tracking
            </h3>

            <div className="rounded-xl border border-slate-200 p-4 text-sm">
              <p>
                <span className="font-semibold text-slate-700">Carrier:</span>{" "}
                {fulfillment.carrier || "Not provided"}
              </p>

              <p className="mt-2">
                <span className="font-semibold text-slate-700">
                  Tracking number:
                </span>{" "}
                {fulfillment.trackingNumber || "Not provided"}
              </p>

              <p className="mt-2">
                <span className="font-semibold text-slate-700">
                  Estimated delivery:
                </span>{" "}
                {fulfillment.estimatedDelivery
                  ? new Date(fulfillment.estimatedDelivery).toLocaleDateString(
                      "en-NG",
                    )
                  : "Not provided"}
              </p>

              {fulfillment.trackingUrl && (
                <a
                  href={fulfillment.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open tracking link
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
