// src/features/admin/orders/components/OrderDetailsModal.tsx

import { useState } from "react";

import { Calculator, MapPin, Package, Truck, X } from "lucide-react";

import type { Order, OrderStatus } from "../order.types";

import { useOrderTimeline } from "../order.queries";
import { useUpdateOrderCBM } from "../order.mutations";

import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTimeline } from "./OrderTimeline";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getAvailableTransitions(status: OrderStatus) {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  return transitions[status];
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">(
    "overview",
  );

  const [cbm, setCbm] = useState(String(order.cbm ?? ""));

  const [chargeableWeight, setChargeableWeight] = useState(
    String(order.chargeableWeight ?? ""),
  );

  const timelineQuery = useOrderTimeline(order.id);

  const updateCBMMutation = useUpdateOrderCBM();

  const availableTransitions = getAvailableTransitions(order.status);

  function saveCBM() {
    const totalCBM = Number(cbm);
    const totalChargeableWeight = Number(chargeableWeight);

    if (
      !Number.isFinite(totalCBM) ||
      totalCBM < 0 ||
      !Number.isFinite(totalChargeableWeight) ||
      totalChargeableWeight < 0
    ) {
      window.alert("Enter valid CBM and chargeable weight values.");

      return;
    }

    updateCBMMutation.mutate({
      orderId: order.id,
      payload: {
        totalCBM,
        totalChargeableWeight,
      },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                {order.orderNumber}
              </h2>

              <OrderStatusBadge status={order.status} />
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Created {new Date(order.createdAt).toLocaleString("en-NG")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="shrink-0 border-b border-slate-200 px-5">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 py-3 text-sm font-semibold ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500"
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("timeline")}
              className={`border-b-2 py-3 text-sm font-semibold ${
                activeTab === "timeline"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto">
          {activeTab === "timeline" ? (
            <div className="p-5">
              <OrderTimeline
                events={timelineQuery.data ?? []}
                loading={timelineQuery.isLoading}
              />
            </div>
          ) : (
            <div className="space-y-6 p-5">
              {/* CUSTOMER + SHIPPING */}
              <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-slate-500" />

                    <h3 className="font-bold text-slate-900">Customer</h3>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {order.customerName}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {order.customerEmail || "No email"}
                  </p>

                  {order.customerPhone && (
                    <p className="mt-1 text-sm text-slate-600">
                      {order.customerPhone}
                    </p>
                  )}
                </section>

                <section className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-500" />

                    <h3 className="font-bold text-slate-900">
                      Delivery address
                    </h3>
                  </div>

                  {order.shippingLabel && (
                    <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                      {order.shippingLabel}
                    </p>
                  )}

                  <p className="text-sm text-slate-700">
                    {order.shippingStreet}
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {[
                      order.shippingCity,
                      order.shippingState,
                      order.shippingCountry,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </section>
              </div>

              {/* ITEMS */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-slate-500" />

                  <h3 className="font-bold text-slate-900">Order items</h3>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="divide-y divide-slate-100">
                    {order.items.map((item) => {
                      const image =
                        item.variant.media.find((media) => media.isPrimary)
                          ?.url ?? item.variant.media[0]?.url;

                      return (
                        <div key={item.id} className="flex gap-4 p-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                            {image ? (
                              <img
                                src={image}
                                alt={item.variant.product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package className="h-6 w-6 text-slate-400" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900">
                              {item.variant.product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              SKU: {item.variant.sku}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              {formatCurrency(item.totalPrice)}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {formatCurrency(item.unitPriceSnapshot)} each
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* FINANCIALS */}
              <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-4 font-bold text-slate-900">
                    Order totals
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal</span>

                      <span className="font-medium">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping</span>

                      <span className="font-medium">
                        {formatCurrency(order.shippingCost)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax</span>

                      <span className="font-medium">
                        {formatCurrency(order.taxAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                      <span className="font-bold">Total</span>

                      <span className="font-bold">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-4 font-bold text-slate-900">Payment</h3>

                  {order.payments.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No payment recorded.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">
                              {payment.provider}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {payment.status}
                            </p>
                          </div>

                          <p className="font-semibold text-slate-900">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* FULFILLMENTS */}
              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-slate-500" />

                  <h3 className="font-bold text-slate-900">Fulfillments</h3>
                </div>

                {order.fulfillments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No fulfillments generated for this order.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {order.fulfillments.map((fulfillment) => (
                      <div
                        key={fulfillment.id}
                        className="rounded-lg bg-slate-50 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {fulfillment.type}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {fulfillment.warehouse?.name ?? "No warehouse"}
                            </p>
                          </div>

                          <OrderStatusBadge status={fulfillment.status} />
                        </div>

                        {fulfillment.trackingNumber && (
                          <p className="mt-3 text-sm text-slate-600">
                            Tracking:{" "}
                            <span className="font-medium">
                              {fulfillment.trackingNumber}
                            </span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* CBM */}
              <section className="rounded-xl border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-slate-500" />

                  <h3 className="font-bold text-slate-900">
                    Shipping measurements
                  </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="order-cbm"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Total CBM
                    </label>

                    <input
                      id="order-cbm"
                      type="number"
                      min="0"
                      step="0.0001"
                      value={cbm}
                      onChange={(event) => setCbm(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-chargeable-weight"
                      className="mb-1 block text-sm font-medium text-slate-700"
                    >
                      Chargeable weight
                    </label>

                    <input
                      id="order-chargeable-weight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={chargeableWeight}
                      onChange={(event) =>
                        setChargeableWeight(event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={saveCBM}
                  disabled={updateCBMMutation.isPending}
                  className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateCBMMutation.isPending
                    ? "Saving..."
                    : "Save measurements"}
                </button>
              </section>

              {/* STATUS ACTIONS */}
              {availableTransitions.length > 0 && (
                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 font-bold text-slate-900">
                    Order status
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {availableTransitions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {order.notes && (
                <section className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-2 font-bold text-slate-900">Notes</h3>

                  <p className="text-sm text-slate-600">{order.notes}</p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
