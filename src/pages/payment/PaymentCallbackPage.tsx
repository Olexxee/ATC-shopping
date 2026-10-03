import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";

interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    payment?: {
      id: string;
      reference: string;
      status: string;
      provider?: string;
      paymentType?: string;
      installmentPlanId?: string | null;
      orderId?: string | null;
    };

    order?: {
      id: string;
      orderNumber: string;
      status: string;
    } | null;

    plan?: {
      id: string;
      planNumber: string;
      status: string;
      balanceDue: number | string;
      orderId?: string | null;
    } | null;

    installmentPlan?: {
      id: string;
      planNumber: string;
      status: string;
      balanceDue: number | string;
      orderId?: string | null;
    } | null;
  };
}

type VerificationState = "verifying" | "success" | "failed";

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [state, setState] = useState<VerificationState>("verifying");

  const [message, setMessage] = useState("Confirming your payment...");

  const [isFlexPay, setIsFlexPay] = useState(false);

  useEffect(() => {
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setState("failed");
      setMessage("We could not find your payment reference.");
      return;
    }

    let cancelled = false;

    const verifyPayment = async () => {
      try {
        const response = await api.get<PaymentVerificationResponse>(
          `/api/payments/verify/${encodeURIComponent(reference)}`,
        );

        if (cancelled) {
          return;
        }

        const result = response.data;

        if (!result.success) {
          setState("failed");
          setMessage(result.message || "We could not verify your payment.");
          return;
        }

        const payment = result.data?.payment;

        const paymentIsFlexPay =
          payment?.paymentType === "INSTALLMENT_PAYMENT" ||
          Boolean(payment?.installmentPlanId) ||
          Boolean(result.data?.plan) ||
          Boolean(result.data?.installmentPlan);

        setIsFlexPay(paymentIsFlexPay);

        // ------------------------------------------------------
        // ORDER CREATED
        // ------------------------------------------------------

        const orderId =
          result.data?.order?.id ??
          payment?.orderId ??
          result.data?.plan?.orderId ??
          result.data?.installmentPlan?.orderId ??
          null;

        if (orderId) {
          setState("success");
          setMessage(
            paymentIsFlexPay
              ? "Your FlexPay payment completed and your order is ready. Redirecting..."
              : "Payment confirmed. Redirecting to your order...",
          );

          setTimeout(() => {
            if (!cancelled) {
              navigate(`/orders/${orderId}`, {
                replace: true,
              });
            }
          }, 1200);

          return;
        }

        // ------------------------------------------------------
        // FLEXPAY PAYMENT WITHOUT ORDER
        //
        // This is expected for normal FlexPay installments.
        // The product balance can still be outstanding.
        // ------------------------------------------------------

        if (paymentIsFlexPay) {
          const plan = result.data?.plan ?? result.data?.installmentPlan;

          if (plan?.status === "SHIPPING_DUE") {
            setState("success");
            setMessage(
              "Payment confirmed. Your product balance is paid and shipping payment is now due.",
            );
            return;
          }

          setState("success");
          setMessage(
            "Payment confirmed. Your FlexPay plan has been updated successfully.",
          );
          return;
        }

        // ------------------------------------------------------
        // NON-FLEXPAY PAYMENT WITHOUT ORDER
        // ------------------------------------------------------

        setState("failed");
        setMessage(
          "Payment was verified, but the order could not be identified.",
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        setState("failed");

        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage("We could not verify your payment. Please try again.");
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  // ----------------------------------------------------------
  // VERIFYING
  // ----------------------------------------------------------

  if (state === "verifying") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
          </div>

          <h1 className="mt-6 text-xl font-bold text-gray-900">
            Confirming your payment
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>

          <p className="mt-6 text-xs text-gray-400">
            Please don't close this page.
          </p>
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // SUCCESS
  // ----------------------------------------------------------

  if (state === "success") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-xl font-bold text-gray-900">
            {isFlexPay ? "FlexPay payment successful" : "Payment successful"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>

          {!isFlexPay && (
            <p className="mt-5 text-xs text-gray-400">
              Redirecting to your order...
            </p>
          )}

          {isFlexPay && (
            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/account"
                className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Go to my account
              </Link>

              <Link
                to="/"
                className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ----------------------------------------------------------
  // FAILED
  // ----------------------------------------------------------

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="mt-6 text-xl font-bold text-gray-900">
          Payment verification failed
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Try again
          </button>

          <Link
            to="/orders"
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            View my orders
          </Link>
        </div>
      </div>
    </main>
  );
}
