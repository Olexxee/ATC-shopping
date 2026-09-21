import { useEffect } from "react";
import { Clock3, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentPendingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!reference && !orderId) {
      navigate("/orders", { replace: true });
    }
  }, [navigate, reference, orderId]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Clock3 className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-gray-900">
          Payment pending
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Your payment request has been initiated. Check your mobile
          money phone for the authorization prompt and complete the
          payment there.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Payment reference
          </p>

          <p className="mt-1 break-all text-sm font-medium text-gray-900">
            {reference || "Payment reference unavailable"}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {orderId ? (
            <Link
              to={`/orders/${orderId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              View order
            </Link>
          ) : (
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <ShoppingBag className="h-4 w-4" />
              View my orders
            </Link>
          )}

          <Link
            to="/"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
          >
            Continue shopping
          </Link>
        </div>

        <p className="mt-6 text-xs leading-5 text-gray-400">
          Your order will be updated automatically once the payment
          provider confirms the transaction.
        </p>
      </div>
    </main>
  );
}

