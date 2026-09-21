import { useEffect, useState } from "react";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/cart.queries";
import { useCartStore } from "../../features/cart/cart.store";
import { useMyAddresses } from "../../features/address/address.queries";
import { useCheckout } from "../../features/checkout/checkout.mutations";
import CheckoutAddress from "../../components/checkout/CheckoutAddress";
import CheckoutNotes from "../../components/checkout/CheckoutNotes";
import CheckoutOrderSummary from "../../components/checkout/CheckoutOrderSummary";

type PaymentProvider = "PAYSTACK" | "PAWAPAY";

export default function CheckoutPage() {
  const {
    data: serverCart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCart(true);

  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);

  const {
    data: addresses = [],
    isLoading: isAddressLoading,
    isError: isAddressError,
  } = useMyAddresses();

  const checkoutMutation = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [notes, setNotes] = useState("");

  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>("PAYSTACK");

  const [paymentError, setPaymentError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (serverCart) {
      setCart(serverCart);
    }
  }, [serverCart, setCart]);

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) ?? addresses[0];

      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  const handlePlaceOrder = () => {
    setPaymentError("");

    if (paymentProvider === "PAWAPAY" && !phoneNumber.trim()) {
      setPaymentError("Enter your mobile money phone number to continue.");
      return;
    }
    if (!selectedAddressId || checkoutMutation.isPending) {
      return;
    }

    if (paymentProvider === "PAWAPAY" && !phoneNumber.trim()) {
      return;
    }

    checkoutMutation.mutate(
      {
        addressId: selectedAddressId,
        notes: notes.trim() || undefined,
        paymentProvider,
        phoneNumber:
          paymentProvider === "PAWAPAY" ? phoneNumber.trim() : undefined,
      },
      {
        onSuccess: (response) => {
          const payment = response.data.payment;

          if (payment.provider === "PAYSTACK") {
            if (!payment.authorizationUrl) {
              throw new Error("Payment authorization URL was not returned.");
            }

            window.location.assign(payment.authorizationUrl);
            return;
          }

          if (payment.provider === "PAWAPAY") {
            const params = new URLSearchParams();

            params.set("reference", payment.reference);
            params.set("orderId", response.data.id);

            window.location.assign(`/payment/pending?${params.toString()}`);
          }
        },
      },
    );
  };

  if (isCartLoading && !cart) {
    return <CheckoutSkeleton />;
  }

  if (isCartError && !cart) {
    return (
      <CheckoutMessage
        title="Unable to load your cart"
        message="We couldn't retrieve your cart. Please return to your cart and try again."
        action={
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
        }
      />
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <CheckoutMessage
        title="Your cart is empty"
        message="Add some products to your cart before checking out."
        action={
          <Link
            to="/products"
            className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white">
              <Lock className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review your order and delivery details.
              </p>
            </div>
          </div>
        </div>

        {checkoutMutation.isError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {checkoutMutation.error instanceof Error
              ? checkoutMutation.error.message
              : "Unable to create your order. Please try again."}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <CheckoutAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              isLoading={isAddressLoading}
              isError={isAddressError}
            />

            <CheckoutNotes value={notes} onChange={setNotes} />

            <PaymentMethodCard
              paymentProvider={paymentProvider}
              onChange={setPaymentProvider}
              phoneNumber={phoneNumber}
              onPhoneNumberChange={setPhoneNumber}
            />
            {paymentError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {paymentError}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <CheckoutOrderSummary
              cart={cart}
              selectedAddress={selectedAddress}
              isSubmitting={checkoutMutation.isPending}
              onSubmit={handlePlaceOrder}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

interface PaymentMethodCardProps {
  paymentProvider: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
}

function PaymentMethodCard({
  paymentProvider,
  onChange,
  phoneNumber,
  onPhoneNumberChange,
}: PaymentMethodCardProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900">
          Payment method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to pay for this order.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <PaymentMethodOption
          selected={paymentProvider === "PAYSTACK"}
          onClick={() => onChange("PAYSTACK")}
          title="Paystack"
          description="Pay securely with card, bank transfer, or supported payment methods."
        />

        <PaymentMethodOption
          selected={paymentProvider === "PAWAPAY"}
          onClick={() => onChange("PAWAPAY")}
          title="Mobile Money"
          description="Pay directly from your supported mobile-money account."
        />
      </div>

      {paymentProvider === "PAWAPAY" && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <label
            htmlFor="pawapay-phone"
            className="block text-sm font-medium text-gray-900"
          >
            Mobile money phone number
          </label>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Enter the phone number connected to your mobile-money account.
          </p>

          <input
            id="pawapay-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange(event.target.value)}
            placeholder="+2348012345678"
            className="mt-3 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
          />

          <div className="mt-3 flex gap-2 text-xs leading-5 text-gray-500">
            <span className="mt-0.5 shrink-0">ⓘ</span>

            <p>
              You will receive a mobile-money authorization prompt on this
              number when the payment is initiated.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

interface PaymentMethodOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

function PaymentMethodOption({
  selected,
  onClick,
  title,
  description,
}: PaymentMethodOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900"
          : "border-gray-200 bg-white hover:border-gray-400"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            selected ? "border-gray-900" : "border-gray-300"
          }`}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-gray-900" />
          )}
        </span>

        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>

          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-gray-200" />

          <div className="mt-5 h-9 w-40 rounded bg-gray-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="h-40 rounded-2xl bg-gray-200" />
            </div>

            <div className="h-[500px] rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  );
}

function CheckoutMessage({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <ShoppingBag className="h-7 w-7 text-gray-500" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-gray-900">{title}</h1>

        <p className="mt-2 text-sm text-gray-500">{message}</p>

        <div className="mt-6">{action}</div>
      </div>
    </main>
  );
}

// ```

// There is **one frontend dependency we now need to inspect before changing the checkout mutation**:

// ```text
// useCheckout()
// ```

// Your current `CheckoutPage` is sending only:

// ```ts
// {
//   addressId,
//   notes
// }
// ```

// but the new UI sends:

// ```ts
// {
//   addressId,
//   notes,
//   paymentProvider,
//   phoneNumber
// }
// ```

// So **don't change `CheckoutOrderSummary` yet**. It doesn't need to know anything about the payment provider.

// Paste your:

// ```text
// features/checkout/checkout.mutations.ts
// ```

// and, if it exists separately, the checkout API/types file it uses. That's the next file we need to update so this UI actually reaches the backend correctly.
