import { ArrowLeft, CheckCircle2, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../../features/order/order.queries";
import type { Order } from "../../features/order/order.types";


export default function OrderPage() {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return <OrderPageSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <OrderMessage
        title="Unable to load your order"
        message="We couldn't retrieve this order. Please try again."
      />
    );
  }

  const order = response.data;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order placed
                  </h1>

                  <p className="mt-1 text-sm text-gray-500">
                    Order #{order.orderNumber}
                  </p>
                </div>
              </div>
            </div>

            <OrderStatus status={order.status} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>

              <div className="mt-5 divide-y divide-gray-100">
                {order.items.map((item) => (
                  <OrderItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Delivery address
              </h2>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.customerName}
                </p>

                <p>{order.shippingStreet}</p>

                <p>
                  {order.shippingCity}
                  {order.shippingState ? `, ${order.shippingState}` : ""}
                </p>

                <p>{order.shippingCountry}</p>

                {order.customerPhone && (
                  <p className="mt-2">{order.customerPhone}</p>
                )}
              </div>
            </section>

            {order.notes && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order notes
                </h2>

                <p className="mt-3 text-sm text-gray-600">{order.notes}</p>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <OrderSummary order={order} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function OrderItemRow({ item }: { item: Order["items"][number] }) {
  const image =
    item.variant.media.find((media: { isPrimary: any; }) => media.isPrimary)?.url ??
    item.variant.media[0]?.url;

  const unitPrice = Number(item.unitPriceSnapshot);
  const totalPrice = Number(item.totalPrice);

  return (
    <div className="flex gap-4 py-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={item.variant.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-7 w-7 text-gray-400" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium text-gray-900">
          {item.variant.product.name}
        </h3>

        <p className="mt-1 text-xs text-gray-500">SKU: {item.variant.sku}</p>

        <p className="mt-2 text-sm text-gray-500">
          {item.quantity} × ₦{unitPrice.toLocaleString()}
        </p>
      </div>

      <p className="shrink-0 font-semibold text-gray-900">
        ₦{totalPrice.toLocaleString()}
      </p>
    </div>
  );
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>

      <div className="mt-5 space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={order.subtotal} />

        <SummaryRow label="Shipping" value={order.shippingCost} />

        <SummaryRow label="Tax" value={order.taxAmount} />

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>

            <span className="text-xl font-bold text-gray-900">
              ₦{Number(order.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{label}</span>

      <span className="font-medium text-gray-900">
        ₦{Number(value).toLocaleString()}
      </span>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
      {status.replaceAll("_", " ")}
    </span>
  );
}

function OrderPageSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-32 rounded bg-gray-200" />

        <div className="mt-6 h-32 rounded-2xl bg-gray-200" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <div className="h-80 rounded-2xl bg-gray-200" />
            <div className="h-48 rounded-2xl bg-gray-200" />
          </div>

          <div className="h-72 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </main>
  );
}

function OrderMessage({ title, message }: { title: string; message: string }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <Package className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <Link
          to="/products"
          className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
