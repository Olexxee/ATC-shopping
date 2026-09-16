import {
  ArrowRight,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "../../components/layout/Container";
import { useMyOrders } from "../../features/order/order.queries";

export default function OrdersPage() {
  const {
    data: response,
    isLoading,
    isError,
  } = useMyOrders({
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return <OrdersPageSkeleton />;
  }

  if (isError || !response?.data) {
    return (
      <OrdersMessage
        title="Unable to load your orders"
        message="We couldn't retrieve your orders. Please try again."
      />
    );
  }

  const orders = response.data;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <Container>
        <div className="py-8">
          <div className="mb-4">
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
              Orders
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              View your order history and track your purchases.
            </p>
          </div>

          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

function OrderCard({
  order,
}: {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number | string;
    createdAt: string;
    items: Array<{
      id: string;
      quantity: number;
      variant: {
        product: {
          name: string;
        };
        media: Array<{
          url: string;
          isPrimary: boolean;
          sortOrder: number;
        }>;
      };
    }>;
  };
}) {
  const firstItem = order.items[0];

  const image =
    firstItem?.variant.media.find(
      (media) => media.isPrimary,
    )?.url ??
    firstItem?.variant.media[0]?.url;

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-neutral-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Order
          </p>

          <p className="mt-1 font-semibold text-neutral-950">
            #{order.orderNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-600">
            {order.status.replaceAll("_", " ")}
          </span>

          <span className="text-sm text-neutral-500">
            {formatOrderDate(order.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex gap-4 p-5">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          {image ? (
            <img
              src={image}
              alt={firstItem?.variant.product.name ?? "Order item"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-7 w-7 text-neutral-400" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-neutral-950">
            {firstItem?.variant.product.name ?? "Order items"}
          </p>

          {order.items.length > 1 && (
            <p className="mt-1 text-sm text-neutral-500">
              + {order.items.length - 1}{" "}
              {order.items.length - 1 === 1
                ? "other item"
                : "other items"}
            </p>
          )}

          <p className="mt-2 text-sm text-neutral-500">
            {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between">
          <p className="font-semibold text-neutral-950">
            ₦{Number(order.totalAmount).toLocaleString()}
          </p>

          <Link
            to={`/orders/${order.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-950"
          >
            View order
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <Package className="h-6 w-6 text-neutral-500" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-neutral-950">
        No orders yet
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-500">
        Your orders will appear here after you complete a purchase.
      </p>

      <Link
        to="/products"
        className="mt-6 inline-flex rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Start shopping
      </Link>
    </div>
  );
}

function OrdersPageSkeleton() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <Container>
        <div className="animate-pulse py-10">
          <div className="h-4 w-20 rounded bg-neutral-200" />

          <div className="mt-3 h-8 w-32 rounded bg-neutral-200" />

          <div className="mt-2 h-4 w-72 rounded bg-neutral-200" />

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-neutral-200"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}

function OrdersMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Package className="h-6 w-6 text-neutral-500" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-neutral-950">
          {title}
        </h1>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          {message}
        </p>
      </div>
    </main>
  );
}

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}
